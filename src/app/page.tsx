import { BellRing, Cpu, HardDrive, Shield, TerminalSquare } from "lucide-react";

import { Hero } from "@/components/home/Hero";
import { MostSoldSection } from "@/components/home/MostSoldSection";
import {
  controlShortcuts,
  dashboardAlerts,
  dashboardServices,
  dashboardStats,
  demoServers,
  infraHighlights,
} from "@/lib/vps-content";

export const dynamic = "force-dynamic";

const accentStyles: Record<string, string> = {
  online: "text-[#00ff88]",
  cyan: "text-cyan-300",
  purple: "text-fuchsia-300",
  warning: "text-amber-300",
};

export default function HomePage() {
  const pinnedServers = demoServers.slice(0, 3);

  return (
    <div className="space-y-8">
      <Hero />

      <section className="grid gap-4 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <article key={stat.label} className="glass-card rounded-[1.8rem] border border-white/10 p-5">
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-text-soft">{stat.label}</p>
            <p className={`mt-3 text-4xl font-semibold ${accentStyles[stat.accent]}`}>{stat.value}</p>
            <p className="mt-2 text-sm text-text-soft">{stat.delta}</p>
          </article>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="glass-card rounded-[2rem] border border-white/10 p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Infra fleet</p>
              <h2 className="mt-2 text-3xl font-semibold text-text-strong">Servidores em operação</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">12 nodes</div>
          </div>

          <div className="mt-6 space-y-4">
            {pinnedServers.map((server) => (
              <div key={server.id} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-white">{server.name}</h3>
                      <span className="rounded-full border border-[#00ff88]/20 bg-[#00ff88]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-[#00ff88]">
                        {server.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-text-soft">{server.region} · {server.os} · {server.ip}</p>
                  </div>
                  <div className="text-right text-sm text-text-soft">
                    <p>{server.plan}</p>
                    <p>{server.uptime} de uptime</p>
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
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Serviços gerenciados</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {dashboardServices.map((item) => (
                <div key={item.title} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center gap-2 text-cyan-300">
                    <item.icon size={16} />
                    <span className="text-sm font-medium">{item.title}</span>
                  </div>
                  <p className="mt-3 text-2xl font-semibold text-white">{item.value}</p>
                  <p className="mt-2 text-sm text-text-soft">{item.note}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <div className="flex items-center gap-2 text-cyan-300">
              <BellRing size={18} />
              <p className="text-xs font-semibold uppercase tracking-[0.28em]">Alertas</p>
            </div>
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

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div className="glass-card rounded-[2rem] border border-white/10 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Core features</p>
            <h2 className="mt-2 text-3xl font-semibold text-text-strong">Operação com cara de painel premium</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {infraHighlights.map((item) => (
              <article key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
                  <item.icon size={18} />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-text-soft">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>

        <div className="glass-card rounded-[2rem] border border-white/10 p-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Console rápido</p>
            <h2 className="mt-2 text-3xl font-semibold text-text-strong">Ações operacionais</h2>
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {controlShortcuts.map((item) => (
              <article key={item.title} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
                <div className="flex items-center gap-3 text-cyan-300">
                  <item.icon size={18} />
                  <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-text-soft">{item.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <MostSoldSection />

      <section className="glass-card rounded-[2rem] border border-white/10 p-6">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
            <TerminalSquare size={18} />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Resumo operacional</p>
            <h2 className="mt-1 text-3xl font-semibold text-text-strong">Pronto para substituir o catálogo antigo</h2>
          </div>
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Summary icon={Cpu} title="CPU & métricas" copy="Visão em tempo real por servidor com barras de uso e alertas visuais." />
          <Summary icon={HardDrive} title="Backups & storage" copy="Volumes NVMe, retenção configurável e monitoramento de snapshots." />
          <Summary icon={Shield} title="Segurança & billing" copy="Firewall, postura operacional e ciclo de cobrança no mesmo painel." />
        </div>
      </section>
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

function Summary({ icon: Icon, title, copy }: { icon: typeof Cpu; title: string; copy: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
        <Icon size={18} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-text-soft">{copy}</p>
    </article>
  );
}
