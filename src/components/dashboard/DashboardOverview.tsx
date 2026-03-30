import Link from "next/link";
import { ArrowRight, CreditCard, Server, ShieldCheck } from "lucide-react";

import type { PublicUser } from "@/lib/auth";
import { billingRecords, dashboardAlerts, dashboardStats, demoServers } from "@/lib/vps-content";

export function DashboardOverview({ user }: { user: PublicUser }) {
  const ownedServers = demoServers.slice(0, 2);
  const pendingInvoices = billingRecords.filter((record) => record.status !== "paid");

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Dashboard do cliente</p>
            <h1 className="mt-2 text-4xl font-semibold text-text-strong">Olá, {user.name.split(" ")[0]}</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-soft">
              Acompanhe seus VPS, uso de recursos, cobranças pendentes e ações rápidas do ambiente contratado.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <QuickTag icon={Server} label={`${ownedServers.length} VPS vinculados`} />
            <QuickTag icon={CreditCard} label={`${pendingInvoices.length} cobranças em aberto`} />
            <QuickTag icon={ShieldCheck} label="Sessão segura ativa" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="glass-card rounded-[1.8rem] border border-white/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-text-soft">{stat.label}</p>
            <p className="mt-3 text-4xl font-semibold text-white">{stat.value}</p>
            <p className="mt-2 text-sm text-text-soft">{stat.delta}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="glass-card rounded-[2rem] border border-white/10 p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Meus servidores</p>
              <h2 className="mt-2 text-3xl font-semibold text-white">Infra contratada</h2>
            </div>
            <Link href="/dashboard/servers" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
              Abrir lista
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="mt-6 space-y-4">
            {ownedServers.map((server) => (
              <div key={server.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{server.name}</h3>
                      <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-emerald-300">
                        {server.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-soft">{server.region} · {server.plan} · {server.ip}</p>
                  </div>
                  <div className="text-right text-sm text-text-soft">
                    <p>{server.uptime} de uptime</p>
                    <p>{server.firewall}</p>
                  </div>
                </div>
                <div className="mt-5 grid gap-4 md:grid-cols-3">
                  <Metric label="CPU" value={server.cpu} />
                  <Metric label="RAM" value={server.ram} />
                  <Metric label="Disco" value={server.disk} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Faturas</p>
                <h2 className="mt-2 text-3xl font-semibold text-white">Pendências financeiras</h2>
              </div>
              <Link href="/dashboard/billing" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white hover:bg-white/10">
                Ver invoices
                <ArrowRight size={14} />
              </Link>
            </div>
            <div className="mt-6 space-y-4">
              {pendingInvoices.map((invoice) => (
                <div key={invoice.id} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-base font-semibold text-white">{invoice.description}</p>
                      <p className="mt-1 text-sm text-text-soft">{invoice.id} · vence em {invoice.dueDate}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-semibold text-white">{invoice.amount}</p>
                      <p className="text-sm text-amber-300">{invoice.status}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Alertas recentes</p>
            <div className="mt-5 space-y-4">
              {dashboardAlerts.map((alert) => (
                <div key={alert.title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-300">{alert.level}</p>
                  <h3 className="mt-2 text-lg font-semibold text-white">{alert.title}</h3>
                  <p className="mt-2 text-sm text-text-soft">{alert.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function QuickTag({ icon: Icon, label }: { icon: typeof Server; label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-cyan-300" />
        {label}
      </div>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex items-center justify-between text-sm text-text-soft">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="metric-bar mt-2 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#00d4ff,#00ff88)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
