import React from "react";
import Link from "next/link";
import { Zap, HeartHandshake, ClipboardCheck } from "lucide-react";
import { cn } from "@/lib/utils";

const steps = [
  {
    icon: Zap,
    title: "Tecnologia Avançada",
    description: "Nosso sistema monitora as melhores ofertas em tempo real para você.",
    color: "bg-blue-50 text-blue-500",
  },
  {
    icon: ClipboardCheck,
    title: "Vasto Catálogo de Opções",
    description: "Centenas de modelos selecionados com foco em qualidade e custo-benefício.",
    color: "bg-cyan-50 text-cyan-500",
  },
  {
    icon: HeartHandshake,
    title: "Sem Compromisso",
    description: "Apresentamos as melhores oportunidades sem taxas ou letras miúdas.",
    color: "bg-indigo-50 text-indigo-500",
  },
];

export function SobreContent() {
  return (
    <div className="flex flex-col gap-12">
      {/* Main Card Section */}
      <section className="bg-bg-surface rounded-[2.5rem] p-12 md:p-20 shadow-card border border-border-soft text-center">
        <div className="space-y-6 mb-16">
          <h1 className="text-4xl md:text-5xl font-black text-text-strong tracking-tight">
            Sobre Nós
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-text-soft leading-relaxed font-medium">
            Nosso compromisso é trazer as melhores ofertas de celulares, 
            utilizando automação inteligente para você.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="bg-bg-muted/30 p-10 rounded-[2rem] border border-border-soft transition-all duration-300 hover:bg-bg-surface hover:shadow-soft group">
              <div className={cn("mx-auto h-20 w-20 rounded-3xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 shadow-sm", step.color)}>
                <step.icon size={36} strokeWidth={1.5} />
              </div>
              <div className="space-y-4">
                <h3 className="text-xl font-black text-text-strong tracking-tight">{step.title}</h3>
                <p className="text-sm font-medium text-text-soft leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section (Opcional, mas mantém a conversão) */}
      <section className="text-center py-12">
        <Link 
          href="/catalogo"
          className="inline-block bg-primary-600 text-white px-10 py-4 rounded-2xl font-black text-lg shadow-soft hover:bg-primary-700 hover:scale-105 transition-all"
        >
          Ver Catálogo Completo
        </Link>
      </section>
    </div>
  );
}
