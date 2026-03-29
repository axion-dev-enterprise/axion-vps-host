import { CloudCog, Mail, TerminalSquare } from "lucide-react";

import { type VpsPlan } from "@/lib/api/vps";
import { formatCurrency } from "@/lib/utils";

type CheckoutSidebarProps = {
  plans: VpsPlan[];
};

export function CheckoutSidebar({ plans }: CheckoutSidebarProps) {
  const monthlyPrices = plans.map((plan) => plan.priceMonthlyCents);
  const lowest = monthlyPrices.length ? Math.min(...monthlyPrices) : 0;
  const highest = monthlyPrices.length ? Math.max(...monthlyPrices) : 0;

  return (
    <aside className="space-y-6">
      <div className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-card">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-primary-500">O que voce leva</p>
        <h2 className="mt-3 text-2xl font-black text-text-strong">Uma experiencia de VPS que nao exige traducao tecnica a cada clique.</h2>
        <p className="mt-3 text-sm leading-relaxed text-text-body">
          Provisionamento, DNS, credenciais e handoff ficam no mesmo fluxo. O cliente compra sem travar e o dev recebe o contexto certo.
        </p>
      </div>

      <div className="rounded-[2rem] border border-border-soft bg-bg-surface p-6 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-text-soft">Faixa de investimento</p>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm text-text-soft">Entrada</p>
            <p className="text-2xl font-black text-text-strong">{formatCurrency(lowest)}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-text-soft">Escala</p>
            <p className="text-2xl font-black text-text-strong">{formatCurrency(highest)}</p>
          </div>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-text-soft">Precos posicionados abaixo da media brasileira para setup assistido, sem vender infra com cara de improviso.</p>
      </div>

      <div className="space-y-4">
        {[
          {
            icon: TerminalSquare,
            title: "Toolkit enterprise",
            copy: "Mantem terminal e operacional real, mas traduz isso em passos claros, checklist e contexto de uso.",
          },
          {
            icon: CloudCog,
            title: "DNS assistido",
            copy: "Suporte a A, CNAME ou fluxo guiado de NS quando o dominio do cliente estiver no Cloudflare.",
          },
          {
            icon: Mail,
            title: "Handoff por e-mail",
            copy: "IP, user root, senha e SSH organizados para o dev instalador assumir a VPS sem retrabalho.",
          },
        ].map((item) => (
          <article key={item.title} className="rounded-[1.8rem] border border-border-soft bg-bg-surface p-5 shadow-soft">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary-soft text-primary-500">
              <item.icon size={20} />
            </div>
            <h3 className="mt-4 text-lg font-black text-text-strong">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-text-body">{item.copy}</p>
          </article>
        ))}
      </div>

      <div className="rounded-[2rem] border border-primary-500/20 bg-[linear-gradient(180deg,rgba(100,245,161,0.12),rgba(9,21,16,0.96))] p-6 shadow-soft">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-primary-500">Setup realista</p>
        <ul className="mt-4 space-y-3 text-sm text-text-body">
          <li>Provisionamento automatico via ServerSpace quando a fila de infraestrutura estiver habilitada.</li>
          <li>Falhas de saldo ou DNS viram status explicito no pedido, sem sumir no escuro.</li>
          <li>O painel prepara a entrega operacional para quem vai instalar a stack do cliente.</li>
        </ul>
      </div>
    </aside>
  );
}
