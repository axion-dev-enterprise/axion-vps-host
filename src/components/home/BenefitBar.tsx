import { FileText, Headphones, ShieldCheck, Truck } from "lucide-react";

const benefits = [
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Operação pronta para todo o Brasil.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: ShieldCheck,
    title: "Garantia",
    description: "Peças originais e serviço especializado.",
    color: "bg-cyan-50 text-cyan-600",
  },
  {
    icon: Headphones,
    title: "Suporte Técnico",
    description: "Atendimento humano e consultivo.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: FileText,
    title: "Orçamento Online",
    description: "Fluxo integrado entre catálogo e contato.",
    color: "bg-orange-50 text-orange-600",
  },
];

export function BenefitBar() {
  return (
    <section className="mx-auto mb-20 mt-20 max-w-[1200px] px-6">
      <div className="grid grid-cols-1 gap-8 rounded-[1.8rem] border border-slate-100 bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] p-10 shadow-soft md:grid-cols-4">
        {benefits.map((benefit) => (
          <div key={benefit.title} className="group flex items-center gap-6 rounded-[1.4rem] px-4 py-3 transition-colors hover:bg-white/80">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl ${benefit.color} transition-transform group-hover:-translate-y-0.5`}>
              <benefit.icon size={32} strokeWidth={2} />
            </div>
            <div className="flex flex-col">
              <h3 className="text-lg font-black text-[#0f172a]">{benefit.title}</h3>
              <p className="text-sm font-medium text-slate-500">{benefit.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
