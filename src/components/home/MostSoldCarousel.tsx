"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight, Flame } from "lucide-react";

import { PhoneImage } from "@/components/catalogo/PhoneImage";
import type { Phone } from "@pontotecc/contract";

const badges = ["Lancamento", "Mais buscado", "Curadoria", "Destaque", "Novo"];

type MostSoldCarouselProps = {
  products: Phone[];
};

export function MostSoldCarousel({ products }: MostSoldCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (products.length <= 1) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % products.length);
    }, 4800);

    return () => window.clearInterval(interval);
  }, [products.length]);

  const goTo = (index: number) => {
    setActiveIndex((index + products.length) % products.length);
  };

  const activeProduct = products[activeIndex];
  const sideProducts = products.filter((_, index) => index !== activeIndex).slice(0, 4);

  if (!activeProduct) {
    return null;
  }

  return (
    <section className="mx-auto mt-20 max-w-[1440px] px-6 md:px-10">
      <div className="mb-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-orange-200/70 bg-orange-100/80 text-orange-600 shadow-lg shadow-orange-100">
            <Flame size={24} fill="currentColor" />
          </div>
          <div className="flex flex-col">
            <h2 className="text-3xl font-bold text-[#0f172a]">Mais Buscados</h2>
            <span className="text-sm font-bold uppercase tracking-[0.25em] text-slate-400">vitrine com rotação automática</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => goTo(activeIndex - 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-lg transition-all hover:-translate-x-0.5 hover:border-primary-200 hover:text-primary-600"
            aria-label="Produto anterior"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            onClick={() => goTo(activeIndex + 1)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-slate-200/80 bg-white text-slate-500 shadow-lg transition-all hover:translate-x-0.5 hover:border-primary-200 hover:text-primary-600"
            aria-label="Próximo produto"
          >
            <ChevronRight size={22} />
          </button>
          <Link
            href="/catalogo"
            className="ml-2 flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-5 py-3 text-sm font-bold text-primary-600 transition-colors hover:border-primary-300 hover:text-primary-700"
          >
            <span>Ver catálogo completo</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.8fr)]">
        <article className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-[linear-gradient(145deg,#ffffff_0%,#f1f8ff_45%,#e4f4ff_100%)] p-6 shadow-[0_24px_70px_rgba(14,116,144,0.14)] md:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.18),transparent_26%),radial-gradient(circle_at_bottom_right,rgba(59,130,246,0.12),transparent_30%)]" />
          <div className="absolute right-0 top-0 h-48 w-48 translate-x-1/4 -translate-y-1/4 rounded-full bg-cyan-300/30 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 -translate-x-1/4 translate-y-1/4 rounded-full bg-blue-400/15 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-[280px_minmax(0,1fr)]">
            <div className="mx-auto flex w-full max-w-[280px] items-center justify-center">
              <PhoneImage
                imageUrl={activeProduct.imageUrl}
                alt={`${activeProduct.brand} ${activeProduct.model}`}
                featured
                priority
                className="h-[320px] w-[220px] sm:h-[360px] sm:w-[250px]"
              />
            </div>

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-primary-600 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-white">
                  {badges[activeIndex % badges.length]}
                </span>
                <span className="rounded-full border border-slate-200/80 bg-white/80 px-4 py-2 text-[10px] font-black uppercase tracking-[0.35em] text-slate-500">
                  estoque sincronizado
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-balance max-w-xl text-3xl font-bold leading-tight text-[#0f172a] md:text-4xl">
                  {activeProduct.brand} {activeProduct.model}
                </h3>
                <p className="text-sm font-black uppercase tracking-[0.3em] text-primary-600">{activeProduct.storageGb}GB</p>
                <p className="max-w-2xl text-base leading-7 text-slate-600">
                  {activeProduct.shortDescription ??
                    "Catálogo orientado para atendimento consultivo, com foco em disponibilidade, configuração e resposta rápida de orçamento."}
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Diagnóstico</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">Curadoria para compra ou reparo do modelo certo.</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Retorno</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">Solicitação enviada direto para o backend e atendimento.</p>
                </div>
                <div className="rounded-2xl border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-sm">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Fluxo</p>
                  <p className="mt-2 text-sm font-semibold text-slate-700">Sem preço fixo, com proposta orientada por disponibilidade.</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  href={`/contato?produto=${encodeURIComponent(`${activeProduct.brand} ${activeProduct.model}`)}`}
                  className="inline-flex items-center justify-center rounded-full bg-primary-600 px-6 py-3 text-sm font-black text-white shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5 hover:bg-primary-700"
                >
                  Solicitar Orçamento
                </Link>
                <Link
                  href={`/catalogo?q=${encodeURIComponent(activeProduct.brand)}`}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/80 px-6 py-3 text-sm font-bold text-slate-600 transition-colors hover:border-primary-200 hover:text-primary-600"
                >
                  Ver semelhantes
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-2">
                {products.map((product, index) => (
                  <button
                    key={product.id}
                    type="button"
                    onClick={() => goTo(index)}
                    className={`h-2.5 rounded-full transition-all ${
                      index === activeIndex ? "w-10 bg-primary-600" : "w-2.5 bg-slate-300 hover:bg-slate-400"
                    }`}
                    aria-label={`Ir para produto ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>
        </article>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {sideProducts.map((product, index) => (
            <button
              key={product.id}
              type="button"
              onClick={() => goTo(products.findIndex((candidate) => candidate.id === product.id))}
              className="group flex items-center gap-4 rounded-[1.6rem] border border-white/80 bg-white/90 p-4 text-left shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:shadow-hover"
            >
              <PhoneImage
                imageUrl={product.imageUrl}
                alt={`${product.brand} ${product.model}`}
                className="h-[120px] w-[96px] shrink-0 rounded-[1.3rem]"
              />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">
                  {badges[(index + activeIndex + 1) % badges.length]}
                </p>
                <h4 className="mt-2 line-clamp-2 text-base font-bold text-[#0f172a]">
                  {product.brand} {product.model}
                </h4>
                <p className="mt-1 text-sm font-semibold text-primary-600">{product.storageGb}GB</p>
                <p className="mt-2 line-clamp-2 text-sm text-slate-500">
                  {product.shortDescription ?? "Modelo pronto para atendimento consultivo e disponibilidade sob consulta."}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
