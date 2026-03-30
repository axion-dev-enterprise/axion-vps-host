import Link from "next/link";
import { ArrowLeft, Database, HardDrive, Shield, TerminalSquare } from "lucide-react";

import { getServerById, getStatusTone } from "@/lib/vps-content";

type ServerDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ServerDetailPage({ params }: ServerDetailPageProps) {
  const { id } = await params;
  const server = getServerById(id);

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <Link href="/servers" className="inline-flex items-center gap-2 text-sm font-medium text-cyan-300">
          <ArrowLeft size={16} />
          Voltar para servidores
        </Link>

        <div className="mt-5 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-4xl font-semibold text-text-strong">{server.name}</h1>
              <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${getStatusTone(server.status)}`}>
                {server.status}
              </span>
            </div>
            <p className="mt-3 text-sm text-text-soft">{server.region} · {server.os} · {server.plan} · {server.ip}</p>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-body">{server.note}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <ActionChip label="Terminal web" />
            <ActionChip label="Criar backup" />
            <ActionChip label="Reiniciar host" />
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <h2 className="text-2xl font-semibold text-white">Métricas em tempo real</h2>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              <MetricCard label="CPU" value={server.cpu} note="Load estável" />
              <MetricCard label="RAM" value={server.ram} note="Cache saudável" />
              <MetricCard label="Disco" value={server.disk} note="I/O dentro do esperado" />
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <div className="flex items-center gap-3 text-cyan-300">
              <TerminalSquare size={18} />
              <h2 className="text-2xl font-semibold text-white">Terminal web</h2>
            </div>
            <div className="mt-5 rounded-[1.6rem] border border-white/10 bg-[#05070c] p-5 font-mono text-sm text-slate-300">
              <p>$ ssh root@{server.ip}</p>
              <p className="mt-2 text-emerald-300">Last login: Sun Mar 29 20:34:11 2026 from 10.0.0.4</p>
              <p className="mt-2">top - 20:51:42 up {server.uptime}, load average: 0.54, 0.62, 0.71</p>
              <p className="mt-2">Tasks: 148 total, 1 running, 147 sleeping, 0 stopped, 0 zombie</p>
              <p className="mt-2 text-cyan-300">root@{server.id}:~#</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <h2 className="text-2xl font-semibold text-white">Configuração</h2>
            <div className="mt-5 space-y-4 text-sm text-text-body">
              <InfoRow label="Firewall" value={server.firewall} icon={Shield} />
              <InfoRow label="Backups" value={server.backups} icon={Database} />
              <InfoRow label="Bandwidth" value={server.bandwidth} icon={HardDrive} />
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <h2 className="text-2xl font-semibold text-white">Alertas e eventos</h2>
            <div className="mt-5 space-y-3">
              {server.alerts.map((alert) => (
                <div key={alert} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  {alert}
                </div>
              ))}
            </div>
          </div>

          <div className="glass-card rounded-[2rem] border border-white/10 p-6">
            <h2 className="text-2xl font-semibold text-white">Tags</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {server.tags.map((tag) => (
                <span key={tag} className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-300">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

function ActionChip({ label }: { label: string }) {
  return <button className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">{label}</button>;
}

function MetricCard({ label, value, note }: { label: string; value: number; note: string }) {
  return (
    <div className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center justify-between text-sm text-text-soft">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <div className="metric-bar mt-3 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-[linear-gradient(90deg,#00d4ff,#00ff88)]" style={{ width: `${value}%` }} />
      </div>
      <p className="mt-3 text-sm text-text-soft">{note}</p>
    </div>
  );
}

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Shield }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-3 text-cyan-300">
        <Icon size={16} />
        <span className="font-medium text-white">{label}</span>
      </div>
      <span className="text-right text-text-soft">{value}</span>
    </div>
  );
}
