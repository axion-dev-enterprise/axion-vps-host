import { AlertCircle, Package, TrendingUp } from "lucide-react";

import type { AdminOverview } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

const statsConfig = [
  {
    key: "totalProducts",
    label: "Total de Produtos",
    description: "Modelos ativos no catálogo",
    icon: Package,
    color: "bg-blue-50 text-blue-600",
  },
  {
    key: "pendingQuotes",
    label: "Orçamentos Pendentes",
    description: "Solicitações aguardando retorno",
    icon: AlertCircle,
    color: "bg-orange-50 text-orange-600",
  },
  {
    key: "quotesToday",
    label: "Leads do Dia",
    description: "Consultas recebidas hoje",
    icon: TrendingUp,
    color: "bg-green-50 text-green-600",
  },
] as const;

type StatsCardsProps = {
  overview: AdminOverview;
};

export function StatsCards({ overview }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {statsConfig.map((stat) => (
        <div
          key={stat.key}
          className="group flex items-center gap-6 rounded-[2rem] border border-border-soft bg-bg-surface p-8 shadow-soft transition-all hover:shadow-card"
        >
          <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl transition-transform group-hover:scale-110", stat.color)}>
            <stat.icon size={28} />
          </div>
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-text-soft">{stat.label}</p>
            <h3 className="mt-1 text-3xl font-black text-text-strong">{overview[stat.key].toLocaleString("pt-BR")}</h3>
            <p className="mt-1 text-[10px] font-bold text-text-soft">{stat.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
