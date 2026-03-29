"use client";

import type { ComponentType } from "react";
import { useEffect, useMemo, useState, useTransition } from "react";
import {
  Activity,
  CloudCog,
  KeyRound,
  LayoutDashboard,
  LoaderCircle,
  LogOut,
  Mail,
  RefreshCcw,
  Server,
  Settings,
  ShieldCheck,
  TerminalSquare,
} from "lucide-react";

import {
  adminLogin,
  adminLogout,
  getAdminSession,
  getAdminSettings,
  updateAdminSettings,
  type AdminSettings,
} from "@/lib/api/admin";
import {
  adminConfigureVpsDns,
  adminProvisionVpsOrder,
  adminSendInstallerAccess,
  getAdminVpsDashboard,
  getAdminVpsOrders,
  type VpsDashboard,
  type VpsOrder,
} from "@/lib/api/vps";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "overview", label: "Operacao", icon: LayoutDashboard },
  { id: "orders", label: "Pedidos", icon: Server },
  { id: "toolkit", label: "Toolkit", icon: TerminalSquare },
  { id: "settings", label: "Branding", icon: Settings },
] as const;

type ActiveTab = (typeof tabs)[number]["id"];

const defaultSettings: AdminSettings = {
  businessName: "AXION VPS",
  supportEmail: "infra@axionenterprise.cloud",
  whatsappNumber: "+55 11 99999-9999",
  whatsappUrl: "https://wa.me/5511999999999",
  instagramUrl: "https://instagram.com/axionenterprise",
  facebookUrl: "https://facebook.com/axionenterprise",
  locationLabel: "Brasil",
  heroBadge: "Provisionamento assistido de VPS",
  heroResponseTime: "5-25 min",
  updatedAt: "",
};

const defaultDashboard: VpsDashboard = {
  totalOrders: 0,
  activeProvisioning: 0,
  readyServers: 0,
  failedOrders: 0,
  lastOrderAt: undefined,
};

const statusStyles: Record<string, string> = {
  pending_review: "border-amber-500/20 bg-amber-500/10 text-amber-200",
  queued: "border-sky-500/20 bg-sky-500/10 text-sky-200",
  provisioning: "border-primary-500/20 bg-primary-500/10 text-primary-200",
  dns_pending: "border-violet-500/20 bg-violet-500/10 text-violet-200",
  ready: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  credentials_sent: "border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
  failed: "border-red-500/20 bg-red-500/10 text-red-200",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full border px-3 py-1 text-[11px] font-black uppercase tracking-[0.24em]",
        statusStyles[status] ?? "border-border-soft bg-bg-muted text-text-soft",
      )}
    >
      {status.replaceAll("_", " ")}
    </span>
  );
}

function StatCard({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: ComponentType<{ size?: number; className?: string }>;
}) {
  return (
    <article className="rounded-[1.8rem] border border-border-soft bg-bg-surface p-6 shadow-soft">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-[11px] font-black uppercase tracking-[0.24em] text-text-soft">{label}</p>
          <p className="mt-3 text-3xl font-black text-text-strong">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary-500">
          <Icon size={20} />
        </div>
      </div>
      <p className="mt-4 text-sm text-text-soft">{note}</p>
    </article>
  );
}

export function AdminContent() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [login, setLogin] = useState({ email: "admin@pontotecc.local", password: "PontoTecc123!" });
  const [dashboard, setDashboard] = useState<VpsDashboard>(defaultDashboard);
  const [orders, setOrders] = useState<VpsOrder[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [settings, setSettings] = useState<AdminSettings>(defaultSettings);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null,
    [orders, selectedOrderId],
  );

  async function loadData() {
    const [dashboardResponse, ordersResponse, settingsResponse] = await Promise.all([
      getAdminVpsDashboard(),
      getAdminVpsOrders(),
      getAdminSettings(),
    ]);

    setDashboard(dashboardResponse.data);
    setOrders(ordersResponse.data);
    setSettings(settingsResponse.data);
    setSelectedOrderId((current) => current ?? ordersResponse.data[0]?.id ?? null);
  }

  useEffect(() => {
    getAdminSession()
      .then((response) => {
        setSessionEmail(response.data.email);
        return loadData();
      })
      .catch(() => {
        setSessionEmail(null);
      });
  }, []);

  function runAction(action: () => Promise<unknown>, successMessage: string) {
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        await action();
        await loadData();
        setFeedback(successMessage);
      } catch (actionError) {
        setError(actionError instanceof Error ? actionError.message : "Falha na operacao.");
      }
    });
  }

  if (!sessionEmail) {
    return (
      <div className="mx-auto max-w-[540px] rounded-[2.4rem] border border-border-soft bg-bg-surface p-8 shadow-card md:p-10">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary-500">Painel AXION VPS</p>
        <h1 className="mt-3 text-3xl font-black text-text-strong">Console operacional protegido</h1>
        <p className="mt-3 text-sm leading-relaxed text-text-body">
          Acompanhe provisionamento, DNS, status de credenciais e handoff operacional em um fluxo unico.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={(event) => {
            event.preventDefault();
            setError(null);
            startTransition(async () => {
              try {
                const response = await adminLogin(login.email, login.password);
                setSessionEmail(response.data.email);
                await loadData();
              } catch (loginError) {
                setError(loginError instanceof Error ? loginError.message : "Falha no login.");
              }
            });
          }}
        >
          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">E-mail</span>
            <input
              value={login.email}
              onChange={(event) => setLogin((current) => ({ ...current, email: event.target.value }))}
              className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft"
              placeholder="admin@axionenterprise.cloud"
            />
          </label>

          <label className="block space-y-2">
            <span className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">Senha</span>
            <input
              type="password"
              value={login.password}
              onChange={(event) => setLogin((current) => ({ ...current, password: event.target.value }))}
              className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft"
              placeholder="Senha administrativa"
            />
          </label>

          {error ? <div className="rounded-[1.2rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

          <button
            type="submit"
            disabled={isPending}
            className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-primary-600 px-6 text-sm font-black text-[#06120c] transition-all hover:bg-primary-500 disabled:opacity-60"
          >
            {isPending ? <LoaderCircle size={18} className="animate-spin" /> : <ShieldCheck size={18} />}
            {isPending ? "Entrando..." : "Entrar no painel"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="space-y-6">
        <div className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Sessao ativa</p>
          <h2 className="mt-3 text-xl font-black text-text-strong">{sessionEmail}</h2>
          <p className="mt-3 text-sm leading-relaxed text-text-body">
            Painel operacional para provisionamento, DNS Cloudflare, toolkit de terminal e envio de credenciais.
          </p>

          <nav className="mt-6 space-y-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-[1.2rem] px-4 py-3 text-left text-sm font-bold transition-all",
                  activeTab === tab.id
                    ? "bg-primary-600 text-[#06120c]"
                    : "border border-transparent text-text-soft hover:border-border-soft hover:bg-bg-muted hover:text-text-strong",
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={() => runAction(loadData, "Dados operacionais atualizados.")}
              className="inline-flex items-center gap-2 rounded-full border border-border-soft px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-text-strong"
            >
              <RefreshCcw size={14} />
              Atualizar
            </button>
            <button
              type="button"
              onClick={() =>
                startTransition(async () => {
                  await adminLogout();
                  setSessionEmail(null);
                })
              }
              className="inline-flex items-center gap-2 rounded-full border border-red-500/20 px-4 py-3 text-xs font-black uppercase tracking-[0.2em] text-red-200"
            >
              <LogOut size={14} />
              Sair
            </button>
          </div>
        </div>

        <div className="rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(180deg,rgba(100,245,161,0.12),rgba(9,21,16,0.96))] p-6 shadow-soft">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Fila ativa</p>
          <div className="mt-4 space-y-3 text-sm text-text-body">
            <p>{dashboard.activeProvisioning} ordem(ns) em provisionamento.</p>
            <p>{dashboard.readyServers} VPS pronta(s) para handoff.</p>
            <p>{dashboard.failedOrders} ordem(ns) exigindo acao manual.</p>
          </div>
        </div>
      </aside>

      <section className="space-y-6">
        {feedback ? <div className="rounded-[1.2rem] border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">{feedback}</div> : null}
        {error ? <div className="rounded-[1.2rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</div> : null}

        {activeTab === "overview" ? (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <StatCard label="Pedidos" value={String(dashboard.totalOrders)} note="Todas as contratacoes registradas." icon={Activity} />
              <StatCard label="Provisionando" value={String(dashboard.activeProvisioning)} note="Pedidos aguardando ou em criacao de VPS." icon={Server} />
              <StatCard label="Prontas" value={String(dashboard.readyServers)} note="VPS com entrega pronta para operacao." icon={ShieldCheck} />
              <StatCard label="Falhas" value={String(dashboard.failedOrders)} note="Normalmente saldo, DNS ou SMTP faltando." icon={CloudCog} />
            </div>

            <div className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Ultima atividade</p>
                  <h2 className="mt-2 text-2xl font-black text-text-strong">Visao de ponta a ponta</h2>
                </div>
                {dashboard.lastOrderAt ? <StatusBadge status="ready" /> : null}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-text-body">
                O painel foi reorganizado para acompanhar pedido, provisionamento ServerSpace, DNS via Cloudflare e envio de credenciais para o dev instalador no mesmo contexto.
              </p>
              <div className="mt-6 grid gap-4 md:grid-cols-3">
                {[
                  ["1", "Pedido criado no checkout com plano, dominio e operador tecnico."],
                  ["2", "Provisionamento via worker do ServerSpace com status explicito em caso de saldo insuficiente."],
                  ["3", "DNS e handoff por e-mail centralizados por pedido."],
                ].map(([step, copy]) => (
                  <div key={step} className="rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-primary-600 text-sm font-black text-[#06120c]">{step}</div>
                    <p className="mt-4 text-sm leading-relaxed text-text-body">{copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "orders" ? (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
            <div className="rounded-[2rem] border border-border-soft bg-bg-surface p-5 shadow-soft">
              <div className="flex items-center justify-between gap-4 border-b border-border-soft pb-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Fila operacional</p>
                  <h2 className="mt-2 text-2xl font-black text-text-strong">Pedidos VPS</h2>
                </div>
                <span className="text-sm font-semibold text-text-soft">{orders.length} pedidos</span>
              </div>

              <div className="mt-4 space-y-3">
                {orders.map((order) => (
                  <button
                    key={order.id}
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                    className={cn(
                      "w-full rounded-[1.4rem] border p-4 text-left transition-all",
                      selectedOrder?.id === order.id
                        ? "border-primary-500/40 bg-[linear-gradient(180deg,rgba(100,245,161,0.12),rgba(9,21,16,0.95))]"
                        : "border-border-soft bg-[#08130f] hover:border-primary-500/30",
                    )}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-black text-text-strong">{order.companyName}</p>
                        <p className="mt-1 text-xs text-text-soft">{order.customerName} · {order.planId}</p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="mt-3 grid gap-1 text-xs text-text-soft">
                      <span>{order.email}</span>
                      <span>{order.domain || "Sem dominio informado"}</span>
                      <span>{new Date(order.createdAt).toLocaleString("pt-BR")}</span>
                    </div>
                  </button>
                ))}
                {!orders.length ? <div className="rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4 text-sm text-text-soft">Nenhum pedido criado ainda.</div> : null}
              </div>
            </div>

            <div className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft">
              {selectedOrder ? (
                <>
                  <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border-soft pb-5">
                    <div>
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Pedido selecionado</p>
                      <h2 className="mt-2 text-2xl font-black text-text-strong">{selectedOrder.companyName}</h2>
                      <p className="mt-2 text-sm text-text-soft">{selectedOrder.customerName} · {selectedOrder.email} · {selectedOrder.whatsapp}</p>
                    </div>
                    <StatusBadge status={selectedOrder.status} />
                  </div>

                  <div className="mt-5 grid gap-4 md:grid-cols-2">
                    <div className="rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">Infra</p>
                      <div className="mt-3 space-y-2 text-sm text-text-body">
                        <p>Plano: {selectedOrder.planId}</p>
                        <p>Ciclo: {selectedOrder.billingCycle}</p>
                        <p>Toolkit: {selectedOrder.toolkitPreference}</p>
                        <p>Server ID: {selectedOrder.serverId || "Aguardando"}</p>
                        <p>IP: {selectedOrder.serverIp || "Aguardando"}</p>
                      </div>
                    </div>
                    <div className="rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4">
                      <p className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">DNS e handoff</p>
                      <div className="mt-3 space-y-2 text-sm text-text-body">
                        <p>Dominio: {selectedOrder.domain || "Nao informado"}</p>
                        <p>Zona: {selectedOrder.zoneName || selectedOrder.zoneId || "Nao informada"}</p>
                        <p>Registro: {selectedOrder.recordType || "Aguardando"} {selectedOrder.recordName || ""}</p>
                        <p>Dev instalador: {selectedOrder.installerEmail || "Nao informado"}</p>
                        <p>SSH: {selectedOrder.sshCommand || "Aguardando"}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-3">
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => runAction(() => adminProvisionVpsOrder(selectedOrder.id), "Provisionamento disparado para o pedido selecionado.")}
                      className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-5 py-3 text-sm font-black text-[#06120c] disabled:opacity-60"
                    >
                      {isPending ? <LoaderCircle size={16} className="animate-spin" /> : <Server size={16} />}
                      Provisionar VPS
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() =>
                        runAction(
                          () =>
                            adminConfigureVpsDns(selectedOrder.id, {
                              zoneId: selectedOrder.zoneId,
                              zoneName: selectedOrder.zoneName,
                              recordType: selectedOrder.recordType,
                              recordName: selectedOrder.recordName,
                            }),
                          "Configuracao de DNS enviada para o Cloudflare.",
                        )
                      }
                      className="inline-flex items-center gap-2 rounded-full border border-border-soft px-5 py-3 text-sm font-black text-text-strong disabled:opacity-60"
                    >
                      <CloudCog size={16} />
                      Aplicar DNS
                    </button>
                    <button
                      type="button"
                      disabled={isPending}
                      onClick={() => runAction(() => adminSendInstallerAccess(selectedOrder.id), "Credenciais enviadas para o dev instalador.")}
                      className="inline-flex items-center gap-2 rounded-full border border-border-soft px-5 py-3 text-sm font-black text-text-strong disabled:opacity-60"
                    >
                      <Mail size={16} />
                      Enviar credenciais
                    </button>
                  </div>

                  {selectedOrder.failureReason ? (
                    <div className="mt-5 rounded-[1.4rem] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                      {selectedOrder.failureReason}
                    </div>
                  ) : null}

                  <div className="mt-6 rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">Timeline</p>
                    <div className="mt-4 space-y-3">
                      {(selectedOrder.events ?? []).map((event) => (
                        <div key={event.id} className="rounded-[1.2rem] border border-border-soft bg-[#091510] p-3">
                          <div className="flex items-center justify-between gap-4">
                            <p className="text-sm font-black text-text-strong">{event.type}</p>
                            <p className="text-xs text-text-soft">{new Date(event.createdAt).toLocaleString("pt-BR")}</p>
                          </div>
                          <p className="mt-2 text-sm leading-relaxed text-text-body">{event.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4 text-sm text-text-soft">Selecione um pedido para ver detalhes.</div>
              )}
            </div>
          </div>
        ) : null}

        {activeTab === "toolkit" ? (
          <div className="grid gap-6 lg:grid-cols-2">
            <article className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <TerminalSquare className="text-primary-500" size={18} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Terminal toolkit</p>
                  <h2 className="mt-2 text-2xl font-black text-text-strong">Operacao human-friendly</h2>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-text-body">
                <p>1. Provisionar a VPS pelo worker quando o pedido estiver pago e pronto.</p>
                <p>2. Aplicar DNS quando zona e registro ja estiverem validados.</p>
                <p>3. Conferir checklist e enviar credenciais para o dev instalador.</p>
              </div>
            </article>

            <article className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft">
              <div className="flex items-center gap-3">
                <KeyRound className="text-primary-500" size={18} />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Checklist</p>
                  <h2 className="mt-2 text-2xl font-black text-text-strong">Entrega para o instalador</h2>
                </div>
              </div>
              <div className="mt-5 rounded-[1.4rem] border border-border-soft bg-[#08130f] p-4 text-sm text-text-body">
                {selectedOrder?.setupChecklist ? (
                  <pre className="whitespace-pre-wrap font-sans leading-relaxed text-text-body">{selectedOrder.setupChecklist}</pre>
                ) : (
                  <p>Selecione um pedido pronto para visualizar o checklist de setup.</p>
                )}
              </div>
            </article>
          </div>
        ) : null}

        {activeTab === "settings" ? (
          <form
            className="grid gap-4 rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft md:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              runAction(
                () =>
                  updateAdminSettings({
                    businessName: settings.businessName,
                    supportEmail: settings.supportEmail,
                    whatsappNumber: settings.whatsappNumber,
                    whatsappUrl: settings.whatsappUrl,
                    instagramUrl: settings.instagramUrl,
                    facebookUrl: settings.facebookUrl,
                    locationLabel: settings.locationLabel,
                    heroBadge: settings.heroBadge,
                    heroResponseTime: settings.heroResponseTime,
                  }),
                "Branding operacional atualizado.",
              );
            }}
          >
            {[
              ["businessName", "Nome do produto"],
              ["supportEmail", "E-mail de suporte"],
              ["whatsappNumber", "WhatsApp"],
              ["whatsappUrl", "URL do WhatsApp"],
              ["instagramUrl", "Instagram"],
              ["facebookUrl", "Facebook"],
              ["locationLabel", "Operacao / localizacao"],
              ["heroBadge", "Badge comercial"],
              ["heroResponseTime", "Tempo prometido"],
            ].map(([field, label]) => (
              <label key={field} className={field === "locationLabel" ? "space-y-2 md:col-span-2" : "space-y-2"}>
                <span className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">{label}</span>
                <input
                  value={settings[field as keyof AdminSettings] as string}
                  onChange={(event) => setSettings((current) => ({ ...current, [field]: event.target.value }))}
                  className="h-14 w-full rounded-[1.2rem] border border-border-soft bg-[#091510] px-4 text-sm text-text-strong outline-none focus:border-primary-500/40 focus:ring-4 focus:ring-primary-soft"
                />
              </label>
            ))}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isPending}
                className="inline-flex items-center gap-2 rounded-full bg-primary-600 px-6 py-4 text-sm font-black text-[#06120c] disabled:opacity-60"
              >
                {isPending ? <LoaderCircle size={18} className="animate-spin" /> : <Settings size={18} />}
                Salvar branding
              </button>
            </div>
          </form>
        ) : null}
      </section>
    </div>
  );
}
