import Link from "next/link";
import { ArrowRight, Cpu, Globe, HardDrive, Shield, Zap } from "lucide-react";

const heroStats = [
  { label: "Provisionamento", value: "< 10 min" },
  { label: "Data centers", value: "+18 regiões" },
  { label: "Uptime SLA", value: "99.98%" },
];

export function Hero() {
  return (
    <section className="glass-card panel-grid overflow-hidden rounded-[2rem] border border-white/10 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.35)] md:p-10 xl:p-12">
      <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
        <div className="space-y-7">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">
            <Zap size={14} />
            Hospedagem VPS de Alta Performance
          </div>

          <div className="space-y-5">
            <h1 className="text-balance text-5xl font-semibold leading-[0.98] tracking-tight text-text-strong md:text-6xl xl:text-7xl">
              Infra profissional para rodar,
              <span className="text-cyan-300"> escalar</span> e operar sem improviso.
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-text-body md:text-xl">
              Transforme pedidos de hospedagem em servidores prontos para produção com painel unificado,
              métricas em tempo real, backups e controle de billing no mesmo fluxo.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/servers" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300">
              Ver servidores
              <ArrowRight size={18} />
            </Link>
            <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
              Explorar planos
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {heroStats.map((item) => (
              <div key={item.label} className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-text-soft">{item.label}</p>
                <p className="mt-2 text-3xl font-semibold text-white">{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-6 top-6 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-emerald-400/10 blur-3xl" />
          <div className="relative rounded-[2rem] border border-white/10 bg-[rgba(10,14,22,0.92)] p-5 shadow-[0_24px_70px_rgba(0,0,0,0.35)]">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">Cluster overview</p>
                <h2 className="mt-2 text-2xl font-semibold text-white">AXION Cloud Fabric</h2>
              </div>
              <div className="rounded-full border border-[#00ff88]/20 bg-[#00ff88]/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[#00ff88]">
                online
              </div>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <MiniCard icon={Cpu} title="CPU pool" value="24 vCPU" />
              <MiniCard icon={HardDrive} title="Storage" value="1.8 TB NVMe" />
              <MiniCard icon={Globe} title="Throughput" value="9.2 TB" />
              <MiniCard icon={Shield} title="Proteção" value="WAF + ACL" />
            </div>

            <div className="mt-6 rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Uso agregado</span>
                <span>68%</span>
              </div>
              <div className="mt-3 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-[linear-gradient(90deg,#00d4ff,#00ff88)]" />
              </div>
              <p className="mt-3 text-sm text-text-soft">Ambiente preparado para scale-up imediato e contingência multi-região.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MiniCard({ icon: Icon, title, value }: { icon: typeof Cpu; title: string; value: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4">
      <div className="flex items-center gap-2 text-cyan-300">
        <Icon size={16} />
        <span className="text-xs uppercase tracking-[0.24em]">{title}</span>
      </div>
      <p className="mt-3 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}
