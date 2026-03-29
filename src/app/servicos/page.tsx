import Link from "next/link";
import { ShieldCheck, Wrench, Clock3, Smartphone, ArrowRight } from "lucide-react";

import { Topbar } from "@/components/layout/Topbar";

const services = [
  {
    title: "Troca de Tela",
    description: "Avaliação rápida para vidro, display e touch com orientação do atendimento.",
    icon: Smartphone,
  },
  {
    title: "Reparo de Placa",
    description: "Diagnóstico técnico para falhas de energia, carga, sinal e aquecimento.",
    icon: Wrench,
  },
  {
    title: "Manutenção Preventiva",
    description: "Limpeza, revisão e validação para prolongar a vida útil do aparelho.",
    icon: ShieldCheck,
  },
];

export default function ServicosPage() {
  return (
    <main className="min-h-screen bg-bg-app pb-20 font-sans">
      <Topbar />

      <section className="mx-auto mt-8 max-w-[1440px] px-6 md:px-10">
        <div className="overflow-hidden rounded-[2.5rem] border border-border-soft bg-[linear-gradient(135deg,#ffffff_0%,#f0f8ff_55%,#e3f3ff_100%)] p-10 shadow-card md:p-16">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 animate-enter-up">
              <p className="text-sm font-black uppercase tracking-[0.3em] text-primary-700">Serviços PontoTecc</p>
              <h1 className="max-w-3xl text-4xl font-black tracking-tight text-text-strong md:text-6xl">
                Assistência técnica com fluxo simples e atendimento consultivo.
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-text-soft">
                O foco do MVP é responder rápido, orientar o cliente e transformar catálogo e manutenção em um único fluxo de orçamento.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/contato"
                  className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-4 font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700"
                >
                  Solicitar atendimento
                </Link>
                <Link
                  href="/catalogo"
                  className="inline-flex items-center justify-center rounded-full border border-border-mid bg-white px-8 py-4 font-bold text-text-strong transition-all duration-300 hover:-translate-y-0.5 hover:border-primary-600 hover:text-primary-700"
                >
                  Ver catálogo
                </Link>
              </div>
            </div>

            <div className="grid gap-4 animate-enter-up [animation-delay:120ms]">
              <div className="rounded-[2rem] bg-white/80 p-6 shadow-soft backdrop-blur">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Clock3 size={22} />
                </div>
                <p className="font-bold text-text-strong">Triagem rápida</p>
                <p className="mt-1 text-sm text-text-soft">Catálogo, serviço e contato centralizados em uma jornada só.</p>
              </div>
              <div className="rounded-[2rem] bg-white/80 p-6 shadow-soft backdrop-blur">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-600">
                  <ShieldCheck size={22} />
                </div>
                <p className="font-bold text-text-strong">Atendimento orientado</p>
                <p className="mt-1 text-sm text-text-soft">Cada solicitação entra persistida no backend para retorno comercial.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 max-w-[1440px] px-6 md:px-10">
        <div className="grid gap-6 md:grid-cols-3">
          {services.map((service, index) => (
            <article
              key={service.title}
              className="rounded-[2rem] border border-border-soft bg-bg-surface p-8 shadow-soft animate-enter-up"
              style={{ animationDelay: `${180 + index * 80}ms` }}
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-soft text-primary-700">
                <service.icon size={24} />
              </div>
              <h2 className="text-2xl font-black text-text-strong">{service.title}</h2>
              <p className="mt-3 text-text-soft">{service.description}</p>
              <Link
                href={`/contato?produto=${encodeURIComponent(service.title)}`}
                className="mt-6 inline-flex items-center gap-2 font-bold text-primary-700 transition-all duration-300 hover:translate-x-1"
              >
                Solicitar orçamento
                <ArrowRight size={16} />
              </Link>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
