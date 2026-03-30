import Link from "next/link";
import { RefreshCcw, Search, ServerCog, Shield, TerminalSquare } from "lucide-react";

import { SidebarFilters } from "@/components/catalogo/SidebarFilters";
import { demoServers, getStatusTone } from "@/lib/vps-content";

export default function ServersPage() {
  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Servers</p>
            <h1 className="mt-2 text-4xl font-semibold text-text-strong">Meus servidores</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-soft">
              Acompanhe os VPS vinculados ao cliente, com ações rápidas para start, stop, restart e acesso ao console do ambiente.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-white">
              <Search size={16} />
              Buscar servidor
            </button>
            <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950">
              <ServerCog size={16} />
              Contratar novo VPS
            </Link>
          </div>
        </div>
      </section>

      <div className="flex flex-col gap-6 xl:flex-row">
        <SidebarFilters brands={[]} />
        <div className="min-w-0 flex-1 space-y-4">
          {demoServers.slice(0, 3).map((server) => (
            <article key={server.id} className="glass-card rounded-[2rem] border border-white/10 p-5 md:p-6">
              <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-2xl font-semibold text-white">{server.name}</h2>
                    <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${getStatusTone(server.status)}`}>
                      {server.status}
                    </span>
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-300">
                      {server.locationLabel}
                    </span>
                  </div>
                  <p className="text-sm text-text-soft">{server.region} · {server.os} · {server.plan} · {server.ip}</p>
                  <p className="max-w-3xl text-sm leading-relaxed text-text-body">{server.note}</p>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">Start</button>
                  <button className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">Stop</button>
                  <button className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-4 py-3 text-sm font-semibold text-slate-950">
                    <RefreshCcw size={15} />
                    Restart
                  </button>
                  <button className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-3 text-sm font-semibold text-cyan-300">
                    <TerminalSquare size={15} />
                    Console
                  </button>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <ServerMetric label="CPU" value={server.cpu} />
                <ServerMetric label="RAM" value={server.ram} />
                <ServerMetric label="Disco" value={server.disk} />
                <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-text-soft">Proteção</p>
                  <div className="mt-3 flex items-center gap-2 text-white">
                    <Shield size={16} className="text-cyan-300" />
                    <span>{server.firewall}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

function ServerMetric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center justify-between text-sm text-text-soft">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="metric-bar mt-3 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#00d4ff,#00ff88)]" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}
