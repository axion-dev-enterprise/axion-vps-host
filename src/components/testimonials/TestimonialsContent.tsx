import Link from "next/link";
import { Quote, Star } from "lucide-react";

import { cn } from "@/lib/utils";

const testimonials = [
  {
    id: 1,
    name: "Lucas R.",
    text: "Atendimento excepcional! Consegui encontrar o Samsung que eu queria com um preço muito melhor do que nas lojas físicas.",
    rating: 5,
    source: "Magalu",
    sourceColor: "text-blue-500",
  },
  {
    id: 2,
    name: "Ana S.",
    text: "O catálogo é muito completo e fácil de navegar. A equipe de suporte me ajudou a escolher o modelo ideal para o meu trabalho.",
    rating: 5,
    source: "Amazon",
    sourceColor: "text-orange-500",
  },
  {
    id: 3,
    name: "Gabriel M.",
    text: "Processo rápido e sem burocracia. Recomendo para quem busca segurança e as melhores ofertas do mercado atual.",
    rating: 5,
    source: "Mercado Livre",
    sourceColor: "text-yellow-500",
  },
];

export function TestimonialsContent() {
  return (
    <div className="flex flex-col gap-12 pt-10">
      <div className="space-y-4 text-center">
        <h1 className="text-4xl font-black tracking-tight text-text-strong md:text-5xl">Depoimentos dos Nossos Clientes</h1>
        <p className="mx-auto max-w-xl text-lg font-medium text-text-soft">
          Saiba o que quem já utilizou a PontoTecc tem a dizer sobre nossa experiência de busca e cotação.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((item) => (
          <div key={item.id} className="group flex flex-col overflow-hidden rounded-[2.5rem] border border-border-soft bg-bg-surface shadow-soft transition-all duration-300 hover:-translate-y-2 hover:shadow-card">
            <div className="relative flex aspect-[4/3] items-center justify-center overflow-hidden bg-bg-muted/50 p-6">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-bg-surface/20" />
              <div className="relative z-10 flex h-32 w-32 items-center justify-center rounded-full border-4 border-white bg-white text-4xl font-black text-primary-200 shadow-xl">
                {item.name.charAt(0)}
              </div>
              <div className="absolute right-10 top-10 h-4 w-4 rounded-full bg-blue-400/20 blur-sm" />
              <div className="absolute bottom-10 left-10 h-6 w-6 rounded-full bg-purple-400/20 blur-sm" />
            </div>

            <div className="flex flex-1 flex-col gap-6 p-10 pt-6">
              <div className="flex gap-1">
                {[...Array(5)].map((_, index) => (
                  <Star key={index} size={18} className={cn(index < item.rating ? "fill-yellow-400 text-yellow-400" : "text-border-mid")} />
                ))}
              </div>

              <div className="flex-1 space-y-3">
                <h3 className="text-xl font-black tracking-tight text-text-strong">{item.name}</h3>
                <p className="text-sm font-medium italic leading-relaxed text-text-soft">&quot;{item.text}&quot;</p>
              </div>

              <div className="flex items-center justify-between border-t border-border-soft pt-6">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2 w-2 rounded-full bg-current", item.sourceColor)} />
                  <span className={cn("text-xs font-black uppercase tracking-widest", item.sourceColor)}>via {item.source}</span>
                </div>
                <Quote size={20} className="text-bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 space-y-6 rounded-[3rem] border border-border-soft bg-bg-surface p-12 text-center shadow-soft">
        <h2 className="text-2xl font-black text-text-strong">Junte-se a milhares de clientes satisfeitos</h2>
        <p className="mx-auto max-w-2xl font-medium text-text-soft">
          Nossa plataforma já ajudou centenas de pessoas a economizarem tempo e dinheiro na escolha do seu novo smartphone.
        </p>
        <Link href="/contato" className="inline-flex rounded-2xl bg-primary-600 px-12 py-5 text-xl font-black text-white shadow-soft transition-all hover:scale-105 hover:bg-primary-700">
          Quero meu orçamento agora
        </Link>
      </div>
    </div>
  );
}
