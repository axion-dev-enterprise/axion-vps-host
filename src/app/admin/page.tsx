import { Activity, BellRing, Shield, UsersRound, Wrench } from "lucide-react";

import { AdminContent } from "@/components/admin/AdminContent";

export default function AdminPage() {
  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Admin</p>
            <h1 className="mt-2 text-4xl font-semibold text-text-strong">Console administrativo</h1>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-soft">
              Visão global da carteira, usuários, planos do marketplace e todos os servidores provisionados no ambiente.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-4">
            <AdminChip icon={Shield} label="Role admin" />
            <AdminChip icon={Activity} label="Métricas globais" />
            <AdminChip icon={UsersRound} label="Clientes" />
            <AdminChip icon={Wrench} label="Ops" />
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <InfoCard icon={BellRing} title="Alertas operacionais" copy="Incidentes, provisionamento, billing e handoff centralizados em um só lugar." />
        <InfoCard icon={Shield} title="Segurança" copy="Acesso liberado apenas quando o middleware encontra um JWT válido com role admin." />
        <InfoCard icon={UsersRound} title="Gestão de usuários" copy="Base inicial em JSON para bootstrap rápido sem tocar no backend existente." />
        <InfoCard icon={Wrench} title="Marketplace" copy="Admin pronto para revisar planos, acompanhar provisioning e atuar sobre toda a operação." />
      </section>

      <AdminContent />
    </div>
  );
}

function AdminChip({ icon: Icon, label }: { icon: typeof Shield; label: string }) {
  return (
    <div className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-sm font-medium text-white">
      <div className="flex items-center gap-2">
        <Icon size={16} className="text-cyan-300" />
        {label}
      </div>
    </div>
  );
}

function InfoCard({ icon: Icon, title, copy }: { icon: typeof Shield; title: string; copy: string }) {
  return (
    <article className="glass-card rounded-[1.8rem] border border-white/10 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
        <Icon size={18} />
      </div>
      <h2 className="mt-4 text-xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm text-text-soft">{copy}</p>
    </article>
  );
}
