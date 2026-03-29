import Link from "next/link";
import { ArrowRight, CheckCircle2, CloudCog, Mail, Shield, Sparkles, TerminalSquare } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";
import { getVpsPlans } from "@/lib/api/vps";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

const stats = [
  { label: "Provisionamento", value: "5-25 min", note: "Conforme plano e fila de infraestrutura" },
  { label: "DNS guiado", value: "Cloudflare", note: "A ou CNAME automatico quando a zona estiver configurada" },
  { label: "Handoff", value: "E-mail pronto", note: "IP, user root, senha e SSH para o dev instalador" },
];

export default async function HomePage() {
  const plans = await getVpsPlans()
    .then((response) => response.data)
    .catch(() => []);

  return (
    <main className="min-h-screen bg-bg-app font-sans">
      <Topbar />

      <section className="mx-auto max-w-[1440px] px-6 pb-14 pt-8 md:px-10">
        <div className="glass-panel surface-grid relative overflow-hidden rounded-[2rem] border border-border-soft p-8 shadow-card md:p-14">
          <div className="absolute inset-x-0 top-0 h-48 bg-[radial-gradient(circle_at_top,rgba(100,245,161,0.18),transparent_62%)]" />

          <div className="relative grid gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 rounded-full border border-primary-500/20 bg-primary-soft px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary-500">
                <Sparkles size={14} />
                Infra pronta para non-devs
              </div>

              <div className="space-y-5">
                <h1 className="text-balance text-5xl font-black leading-[1.02] tracking-tight text-text-strong md:text-6xl xl:text-7xl">
                  VPS pronta para deploy,
                  <span className="text-primary-500"> DNS simples</span> e handoff sem caos.
                </h1>
                <p className="max-w-2xl text-lg leading-relaxed text-text-body md:text-xl">
                  O AXION VPS entrega provisionamento guiado, setup rapido, apontamento Cloudflare e credenciais organizadas
                  para quem vai operar a maquina. Menos terminal confuso, mais servidor pronto.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/checkout"
                  className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-7 py-4 text-sm font-black text-[#06120c] shadow-[0_18px_48px_rgba(55,215,123,0.18)] transition-all hover:-translate-y-0.5 hover:bg-primary-500"
                >
                  Contratar e provisionar
                  <ArrowRight size={18} />
                </Link>
                <Link href="/admin" className="inline-flex items-center gap-2 rounded-full border border-border-soft bg-bg-surface px-7 py-4 text-sm font-bold text-text-strong transition-colors hover:border-primary-500/30 hover:text-primary-500">
                  Ver painel operacional
                </Link>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                {stats.map((item) => (
                  <div key={item.label} className="rounded-[1.6rem] border border-border-soft bg-[#081512]/85 p-5 shadow-soft">
                    <p className="text-[11px] font-black uppercase tracking-[0.28em] text-text-soft">{item.label}</p>
                    <p className="mt-3 text-3xl font-black text-text-strong">{item.value}</p>
                    <p className="mt-2 text-sm text-text-soft">{item.note}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="absolute -left-8 top-8 h-44 w-44 rounded-full bg-primary-500/12 blur-3xl" />
              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-emerald-400/10 blur-3xl" />
              <div className="relative rounded-[2rem] border border-border-soft bg-[#081612]/92 p-6 shadow-card">
                <div className="flex items-center justify-between border-b border-border-soft pb-4">
                  <div>
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Fluxo guiado</p>
                    <h2 className="mt-2 text-2xl font-black text-text-strong">Checkout + Setup</h2>
                  </div>
                  <div className="rounded-2xl border border-primary-500/25 bg-primary-soft px-4 py-2 text-sm font-bold text-primary-500">
                    enterprise
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  {[
                    ["1", "Escolha o plano e informe dominio, dev instalador e preferencia de setup."],
                    ["2", "A VPS e provisionada e o DNS pode ser apontado pelo Cloudflare da zona do cliente."],
                    ["3", "O painel libera IP, user root, senha e SSH para o handoff operacional."],
                  ].map(([step, copy]) => (
                    <div key={step} className="flex gap-4 rounded-[1.4rem] border border-border-soft bg-bg-muted/60 p-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-[#06120c]">{step}</div>
                      <p className="text-sm leading-relaxed text-text-body">{copy}</p>
                    </div>
                  ))}
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4">
                    <div className="flex items-center gap-3 text-primary-500">
                      <CloudCog size={18} />
                      <span className="text-xs font-black uppercase tracking-[0.24em]">DNS</span>
                    </div>
                    <p className="mt-3 text-sm text-text-body">A, CNAME e fluxo assistido de NS quando a zona estiver com o cliente.</p>
                  </div>
                  <div className="rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4">
                    <div className="flex items-center gap-3 text-primary-500">
                      <Mail size={18} />
                      <span className="text-xs font-black uppercase tracking-[0.24em]">Handoff</span>
                    </div>
                    <p className="mt-3 text-sm text-text-body">Credenciais por e-mail para o dev instalador com o contexto certo.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="planos" className="mx-auto max-w-[1440px] px-6 py-10 md:px-10">
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-primary-500">Planos</p>
            <h2 className="mt-3 text-4xl font-black text-text-strong">Precos abaixo do mercado, sem cara de provisao improvisada.</h2>
          </div>
          <p className="max-w-xl text-sm leading-relaxed text-text-soft">
            Posicionamos os planos entre 20% e 30% abaixo da media praticada no Brasil para setup assistido de VPS com handoff operacional.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article key={plan.id} className="rounded-[2rem] border border-border-soft bg-bg-surface p-7 shadow-soft">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.28em] text-primary-500">{plan.name}</p>
                  <h3 className="mt-3 text-3xl font-black text-text-strong">{formatCurrency(plan.priceMonthlyCents)}</h3>
                  <p className="mt-1 text-sm text-text-soft">por mes ou {formatCurrency(plan.priceYearlyCents)}/mes no anual</p>
                </div>
                <div className="rounded-2xl border border-primary-500/20 bg-primary-soft px-4 py-2 text-xs font-black uppercase tracking-[0.2em] text-primary-500">
                  {plan.setupMinutes}
                </div>
              </div>

              <p className="mt-5 text-sm leading-relaxed text-text-body">{plan.subtitle}</p>

              <div className="mt-6 rounded-[1.4rem] border border-border-soft bg-[#08130f] p-5">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">Recursos</p>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-text-body">
                  <div>{plan.resources.cpu} vCPU</div>
                  <div>{plan.resources.ram} RAM</div>
                  <div>{plan.resources.volume} SSD</div>
                  <div>{plan.resources.publicNetwork} Mbps</div>
                </div>
              </div>

              <ul className="mt-6 space-y-3">
                {plan.highlights.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm text-text-body">
                    <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-primary-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <p className="mt-6 text-sm text-text-soft">{plan.audience}</p>

              <Link
                href={`/checkout?plan=${plan.id}`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-5 py-4 text-sm font-black text-[#06120c] transition-all hover:-translate-y-0.5 hover:bg-primary-500"
              >
                Contratar {plan.name}
                <ArrowRight size={17} />
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section id="setup" className="mx-auto max-w-[1440px] px-6 py-10 md:px-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: TerminalSquare,
              title: "Ferramentas human-friendly",
              copy: "Mantemos a base de terminal e handoff tecnico, mas traduzimos isso em passos claros, copias prontas e contexto operacional.",
            },
            {
              icon: CloudCog,
              title: "Cloudflare no mesmo fluxo",
              copy: "Quando o cliente informar zona e preferencia de apontamento, o painel tenta aplicar A ou CNAME direto na conta Cloudflare configurada.",
            },
            {
              icon: Shield,
              title: "Credenciais com trilha de auditoria",
              copy: "IP, usuario root, senha e SSH ficam organizados por pedido, com log de eventos e envio controlado para o dev instalador.",
            },
          ].map((item) => (
            <div key={item.title} className="rounded-[2rem] border border-border-soft bg-bg-surface p-7 shadow-soft">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary-500">
                <item.icon size={22} />
              </div>
              <h3 className="mt-5 text-2xl font-black text-text-strong">{item.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-text-body">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-6 py-12 md:px-10">
        <div className="rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(135deg,rgba(100,245,161,0.12),rgba(7,17,13,0.96))] p-8 shadow-card md:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-black uppercase tracking-[0.28em] text-primary-500">CTA final</p>
              <h2 className="mt-3 text-4xl font-black text-text-strong">Se o cliente nao e dev, a experiencia precisa fazer sentido no primeiro clique.</h2>
              <p className="mt-4 text-sm leading-relaxed text-text-body">
                O AXION VPS foi desenhado para vender, provisionar, apontar DNS e entregar as credenciais certas sem depender de um operador tecnico para explicar tudo do zero.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/checkout" className="rounded-full bg-primary-600 px-6 py-4 text-sm font-black text-[#06120c]">
                Comecar agora
              </Link>
              <Link href="/admin" className="rounded-full border border-border-soft px-6 py-4 text-sm font-bold text-text-strong">
                Abrir painel
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
