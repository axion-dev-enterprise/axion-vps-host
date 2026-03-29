import React from "react";
import { LayoutGrid, Users, Smartphone } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    icon: LayoutGrid,
    title: "Catálogo Automatizado",
    description: "Centenas de modelos sempre sincronizados com o mercado",
    color: "bg-primary-soft text-primary-600",
  },
  {
    icon: Users,
    title: "Suporte Especializado",
    description: "Nossa equipe auxilia na escolha do aparelho ideal",
    color: "bg-blue-100 text-blue-600",
  },
  {
    icon: Smartphone,
    title: "Os Melhores Modelos",
    description: "Apenas smartphones selecionados por qualidade e custo-benefício",
    color: "bg-purple-100 text-purple-600",
  },
];

export function Features() {
  return (
    <section className="mx-auto mt-12 grid max-w-[1440px] grid-cols-1 gap-8 px-6 pb-20 md:grid-cols-3 md:px-10">
      {features.map((feature, index) => (
        <div
          key={index}
          className="group flex flex-col items-center gap-6 rounded-[2rem] bg-bg-surface p-10 text-center shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card"
        >
          {/* Icon Circle */}
          <div
            className={cn(
              "flex h-20 w-20 items-center justify-center rounded-3xl transition-transform duration-300 group-hover:scale-110",
              feature.color
            )}
          >
            <feature.icon size={36} strokeWidth={1.5} />
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xl font-bold tracking-tight text-text-strong">
              {feature.title}
            </h3>
            <p className="max-w-[240px] text-base leading-relaxed text-text-soft">
              {feature.description}
            </p>
          </div>
        </div>
      ))}
    </section>
  );
}
