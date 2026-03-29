import Link from "next/link";
import { ArrowRight, Lock, Smartphone, Wrench } from "lucide-react";

const cards = [
  {
    title: "Catálogo Completo",
    description: "Acesse modelos com curadoria e imagens reais.",
    icon: Smartphone,
    href: "/catalogo",
    color: "bg-blue-50 text-blue-600",
  },
  {
    title: "Nossos Serviços",
    description: "Conserto, diagnóstico e manutenção especializada.",
    icon: Wrench,
    href: "/servicos",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    title: "Área Restrita",
    description: "Painel interno para operação e acompanhamento.",
    icon: Lock,
    href: "/admin",
    color: "bg-emerald-50 text-emerald-600",
  },
];

export function ActionCards() {
  return (
    <section className="mx-auto mt-12 grid max-w-[1200px] grid-cols-1 gap-6 px-6 md:grid-cols-3">
      {cards.map((card) => (
        <Link
          key={card.title}
          href={card.href}
          className="group relative flex items-center justify-between overflow-hidden rounded-[1.5rem] border border-slate-100 bg-white p-8 shadow-soft transition-all hover:-translate-y-1 hover:shadow-[0_18px_45px_rgba(14,116,144,0.10)]"
        >
          <div className="absolute inset-x-0 top-0 h-1 bg-[linear-gradient(90deg,#38bdf8_0%,#2563eb_100%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <div className="flex items-center gap-6">
            <div className={`flex h-16 w-16 items-center justify-center rounded-2xl ${card.color}`}>
              <card.icon size={32} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-[#0f172a]">{card.title}</h3>
              <p className="max-w-[220px] text-sm font-medium text-slate-500">{card.description}</p>
            </div>
          </div>
          <div className="text-slate-300 transition-transform group-hover:translate-x-1 group-hover:text-primary-600">
            <ArrowRight size={24} />
          </div>
        </Link>
      ))}
    </section>
  );
}
