"use client";

import type { ReactNode } from "react";
import { useMemo, useState, useTransition } from "react";
import { ArrowRight, CheckCircle2, LoaderCircle, Mail, Server, ShieldCheck } from "lucide-react";

import { createVpsOrder, type VpsPlan } from "@/lib/api/vps";
import { cn, formatCurrency } from "@/lib/utils";

type CheckoutFormProps = {
  plans: VpsPlan[];
  initialPlanId?: string;
};

type BillingCycle = "monthly" | "yearly";
type DnsMode = "none" | "a_record" | "cname" | "ns_manual";
type RecordType = "A" | "CNAME" | "NS";
type ToolkitPreference = "managed" | "guided" | "terminal_first";

type FormState = {
  customerName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  installerName: string;
  installerEmail: string;
  planId: string;
  billingCycle: BillingCycle;
  domain: string;
  zoneName: string;
  zoneId: string;
  dnsMode: DnsMode;
  recordType: RecordType;
  recordName: string;
  notes: string;
  toolkitPreference: ToolkitPreference;
};

const toolkitOptions: Array<{ value: ToolkitPreference; label: string; hint: string }> = [
  { value: "managed", label: "Setup assistido", hint: "Melhor para non-devs que querem tudo mastigado no painel." },
  { value: "guided", label: "Guiado com checkpoints", hint: "Mantem autonomia, mas com trilha clara de handoff e DNS." },
  { value: "terminal_first", label: "Terminal first", hint: "Para quem prefere copiar comandos e operar a VPS na mao." },
];

const dnsModes: Array<{ value: DnsMode; label: string; hint: string }> = [
  { value: "a_record", label: "A record automatico", hint: "Aponta o dominio direto para o IP da VPS." },
  { value: "cname", label: "CNAME automatico", hint: "Entrega um fluxo mais flexivel quando a arquitetura pedir alias." },
  { value: "ns_manual", label: "Troca de NS guiada", hint: "O cliente recebe orientacao clara para o registrador." },
  { value: "none", label: "Sem DNS agora", hint: "Provisiona a VPS e deixa o dominio para depois." },
];

function Field({ label, hint, children, className }: { label: string; hint?: string; children: ReactNode; className?: string }) {
  return (
    <label className={cn("space-y-2", className)}>
      <span className="block text-xs font-black uppercase tracking-[0.24em] text-text-soft">{label}</span>
      {children}
      {hint ? <span className="block text-xs leading-relaxed text-text-soft">{hint}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  hint,
  value,
  onChange,
  options,
}: {
  label: string;
  hint?: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
}) {
  return (
    <Field label={label} hint={hint}>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none transition focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </Field>
  );
}

export function CheckoutForm({ plans, initialPlanId }: CheckoutFormProps) {
  const [isPending, startTransition] = useTransition();
  const [createdOrderId, setCreatedOrderId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({
    customerName: "",
    companyName: "",
    email: "",
    whatsapp: "",
    installerName: "",
    installerEmail: "",
    planId: initialPlanId && plans.some((plan) => plan.id === initialPlanId) ? initialPlanId : plans[0]?.id ?? "launch",
    billingCycle: "monthly",
    domain: "",
    zoneName: "",
    zoneId: "",
    dnsMode: "a_record",
    recordType: "A",
    recordName: "",
    notes: "",
    toolkitPreference: "managed",
  });

  const selectedPlan = useMemo(() => plans.find((plan) => plan.id === form.planId) ?? plans[0], [form.planId, plans]);
  const currentPrice = useMemo(() => {
    if (!selectedPlan) return 0;
    return form.billingCycle === "yearly" ? selectedPlan.priceYearlyCents : selectedPlan.priceMonthlyCents;
  }, [form.billingCycle, selectedPlan]);
  const billingLabel = form.billingCycle === "yearly" ? "anual" : "mensal";

  function updateField<Key extends keyof FormState>(key: Key, value: FormState[Key]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handlePlanChange(planId: string) {
    setForm((current) => ({
      ...current,
      planId,
      recordType: current.dnsMode === "cname" ? "CNAME" : current.dnsMode === "ns_manual" ? "NS" : "A",
      recordName: current.recordName || current.domain || "@",
    }));
  }

  function handleDnsModeChange(mode: string) {
    const nextMode = mode as DnsMode;
    updateField("dnsMode", nextMode);
    updateField("recordType", nextMode === "cname" ? "CNAME" : nextMode === "ns_manual" ? "NS" : "A");
  }

  const canSubmit = Boolean(form.customerName.trim() && form.companyName.trim() && form.email.trim() && form.whatsapp.trim() && form.planId);

  return (
    <div className="space-y-6">
      <div className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-card md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-primary-500">Contratacao guiada</p>
            <h1 className="mt-3 text-3xl font-black text-text-strong md:text-4xl">Provisione a VPS sem depender de um operador tecnico em cada passo.</h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-text-body md:text-base">
              Escolha o plano, informe o dominio e diga quem vai instalar a stack. O painel organiza provisionamento,
              apontamento DNS e handoff do ambiente sem friccao desnecessaria.
            </p>
          </div>
          <div className="rounded-[1.4rem] border border-primary-500/20 bg-primary-soft px-5 py-4 text-right">
            <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary-500">Setup estimado</p>
            <p className="mt-2 text-2xl font-black text-text-strong">{selectedPlan?.setupMinutes ?? "5-25 min"}</p>
          </div>
        </div>
      </div>

      <form
        className="space-y-6"
        onSubmit={(event) => {
          event.preventDefault();
          setError(null);
          setFeedback(null);
          startTransition(async () => {
            try {
              const response = await createVpsOrder({
                customerName: form.customerName.trim(),
                companyName: form.companyName.trim(),
                email: form.email.trim(),
                whatsapp: form.whatsapp.trim(),
                installerName: form.installerName.trim() || undefined,
                installerEmail: form.installerEmail.trim() || undefined,
                planId: form.planId,
                billingCycle: form.billingCycle,
                domain: form.domain.trim() || undefined,
                zoneName: form.zoneName.trim() || undefined,
                zoneId: form.zoneId.trim() || undefined,
                dnsMode: form.dnsMode,
                recordType: form.recordType,
                recordName: form.recordName.trim() || undefined,
                notes: form.notes.trim() || undefined,
                toolkitPreference: form.toolkitPreference,
              });
              setCreatedOrderId(response.data.id);
              setFeedback("Pedido criado. A trilha operacional ja foi aberta para provisionamento, DNS e envio de credenciais.");
            } catch (submitError) {
              setError(submitError instanceof Error ? submitError.message : "Nao foi possivel criar o pedido agora.");
            }
          });
        }}
      >
        <section className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft md:p-7">
          <div className="flex items-center gap-3">
            <Server className="text-primary-500" size={18} />
            <div>
              <h2 className="text-xl font-black text-text-strong">Plano e faturamento</h2>
              <p className="text-sm text-text-soft">Planos reajustados para seguir abaixo da media brasileira de setup e operacao assistida.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 xl:grid-cols-3">
            {plans.map((plan) => {
              const isActive = plan.id === form.planId;
              const price = form.billingCycle === "yearly" ? plan.priceYearlyCents : plan.priceMonthlyCents;
              return (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => handlePlanChange(plan.id)}
                  className={cn(
                    "rounded-[1.6rem] border p-5 text-left transition-all",
                    isActive ? "border-primary-500/50 bg-[linear-gradient(180deg,rgba(100,245,161,0.16),rgba(9,21,16,0.95))] shadow-[0_18px_40px_rgba(55,215,123,0.12)]" : "border-border-soft bg-[#08130f] hover:border-primary-500/30 hover:bg-[#0a1812]",
                  )}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">{plan.name}</p>
                      <h3 className="mt-3 text-3xl font-black text-text-strong">{formatCurrency(price)}</h3>
                      <p className="mt-1 text-xs text-text-soft">por mes no ciclo {billingLabel}</p>
                    </div>
                    {isActive ? <CheckCircle2 className="text-primary-500" size={20} /> : null}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-text-body">{plan.subtitle}</p>
                  <div className="mt-5 grid grid-cols-2 gap-3 text-xs font-semibold text-text-soft">
                    <span>{plan.resources.cpu} vCPU</span>
                    <span>{plan.resources.ram} RAM</span>
                    <span>{plan.resources.volume} SSD</span>
                    <span>{plan.resources.publicNetwork} Mbps</span>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <SelectField label="Ciclo" value={form.billingCycle} onChange={(value) => updateField("billingCycle", value as BillingCycle)} options={[{ value: "monthly", label: "Mensal" }, { value: "yearly", label: "Anual com custo mensal reduzido" }]} />
            <Field label="Resumo do plano" hint={selectedPlan?.audience}>
              <div className="flex h-14 items-center rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong">
                {selectedPlan ? `${selectedPlan.name} · ${formatCurrency(currentPrice)}/mes` : "Selecione um plano"}
              </div>
            </Field>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft md:p-7">
          <div className="flex items-center gap-3">
            <ShieldCheck className="text-primary-500" size={18} />
            <div>
              <h2 className="text-xl font-black text-text-strong">Dados do cliente e do operador</h2>
              <p className="text-sm text-text-soft">Centralize quem compra, quem responde pelo negocio e quem vai operar a maquina.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Nome do responsavel"><input value={form.customerName} onChange={(event) => updateField("customerName", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="Quem esta contratando" /></Field>
            <Field label="Empresa"><input value={form.companyName} onChange={(event) => updateField("companyName", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="Nome da operacao" /></Field>
            <Field label="E-mail"><input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="financeiro@empresa.com" /></Field>
            <Field label="WhatsApp"><input value={form.whatsapp} onChange={(event) => updateField("whatsapp", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="+55 11 99999-9999" /></Field>
            <Field label="Dev instalador" hint="Opcional, mas recomendado para liberar o handoff automatico."><input value={form.installerName} onChange={(event) => updateField("installerName", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="Nome de quem vai operar" /></Field>
            <Field label="E-mail do dev instalador"><input type="email" value={form.installerEmail} onChange={(event) => updateField("installerEmail", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="dev@parceiro.com" /></Field>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft md:p-7">
          <div className="flex items-center gap-3">
            <Mail className="text-primary-500" size={18} />
            <div>
              <h2 className="text-xl font-black text-text-strong">Dominio, DNS e modo de setup</h2>
              <p className="text-sm text-text-soft">Deixe o apontamento previsivel para o cliente e o operador tecnico.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Dominio principal" hint="Ex.: app.suaempresa.com.br"><input value={form.domain} onChange={(event) => updateField("domain", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="app.suaempresa.com.br" /></Field>
            <Field label="Nome da zona no Cloudflare" hint="Ex.: suaempresa.com.br"><input value={form.zoneName} onChange={(event) => updateField("zoneName", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="suaempresa.com.br" /></Field>
            <Field label="Zone ID" hint="Opcional. Se nao informar, o sistema tenta localizar pela zona."><input value={form.zoneId} onChange={(event) => updateField("zoneId", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="Cloudflare zone id" /></Field>
            <Field label="Nome do registro" hint="Use @ para raiz ou subdominio exato."><input value={form.recordName} onChange={(event) => updateField("recordName", event.target.value)} className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="@ ou app" /></Field>
            <div className="md:col-span-2"><SelectField label="Modo DNS" value={form.dnsMode} onChange={handleDnsModeChange} hint={dnsModes.find((mode) => mode.value === form.dnsMode)?.hint} options={dnsModes.map((mode) => ({ value: mode.value, label: mode.label }))} /></div>
            <div className="md:col-span-2">
              <Field label="Preferencia operacional">
                <div className="grid gap-3 lg:grid-cols-3">
                  {toolkitOptions.map((option) => {
                    const active = form.toolkitPreference === option.value;
                    return (
                      <button key={option.value} type="button" onClick={() => updateField("toolkitPreference", option.value)} className={cn("rounded-[1.4rem] border p-4 text-left transition-all", active ? "border-primary-500/50 bg-[linear-gradient(180deg,rgba(100,245,161,0.14),rgba(9,21,16,0.95))]" : "border-border-soft bg-[#08130f] hover:border-primary-500/30")}>
                        <p className="text-sm font-black text-text-strong">{option.label}</p>
                        <p className="mt-2 text-xs leading-relaxed text-text-soft">{option.hint}</p>
                      </button>
                    );
                  })}
                </div>
              </Field>
            </div>
            <div className="md:col-span-2"><Field label="Observacoes do setup" hint="Contexto de stack, prioridades, portas ou detalhes operacionais."><textarea value={form.notes} onChange={(event) => updateField("notes", event.target.value)} rows={5} className="w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 py-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft" placeholder="Ex.: subir app Node + Postgres, liberar 80/443 e deixar pronto para Cloudflare proxy." /></Field></div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft md:p-7">
          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Resumo operacional</p>
              <h2 className="mt-2 text-2xl font-black text-text-strong">{selectedPlan?.name ?? "Plano"} com entrega {form.toolkitPreference === "managed" ? "assistida" : form.toolkitPreference === "guided" ? "guiada" : "terminal-first"}</h2>
              <p className="mt-3 text-sm leading-relaxed text-text-body">O pedido vai abrir a fila de provisionamento, registrar a preferencia de DNS e preparar o handoff com IP, usuario, senha root e SSH para o dev instalador.</p>
            </div>
            <div className="rounded-[1.6rem] border border-primary-500/20 bg-primary-soft px-6 py-5">
              <p className="text-[11px] font-black uppercase tracking-[0.24em] text-primary-500">Investimento</p>
              <p className="mt-2 text-3xl font-black text-text-strong">{formatCurrency(currentPrice)}</p>
              <p className="mt-1 text-xs text-text-soft">por mes no ciclo {billingLabel}</p>
            </div>
          </div>
          {feedback ? <div className="mt-5 rounded-[1.4rem] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{feedback}{createdOrderId ? <div className="mt-1 font-semibold text-emerald-100">Pedido: {createdOrderId}</div> : null}</div> : null}
          {error ? <div className="mt-5 rounded-[1.4rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <button type="submit" disabled={!canSubmit || isPending} className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-4 text-sm font-black text-[#06120c] transition-all hover:-translate-y-0.5 hover:bg-primary-500 disabled:cursor-not-allowed disabled:opacity-60">
              {isPending ? <LoaderCircle size={18} className="animate-spin" /> : <ArrowRight size={18} />}
              {isPending ? "Abrindo pedido..." : "Criar pedido e iniciar setup"}
            </button>
            <div className="flex items-center text-sm text-text-soft">Sem travar o cliente em jargao tecnico. O painel assume a parte operacional.</div>
          </div>
        </section>
      </form>
    </div>
  );
}
