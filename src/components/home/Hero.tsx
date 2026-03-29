import Link from "next/link";
import { ArrowRight, Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

type HeroProps = {
  heroBadge?: string;
  heroResponseTime?: string;
};

export function Hero({ heroBadge = "MVP de catálogo e atendimento", heroResponseTime = "24h" }: HeroProps) {
  return (
    <section className="relative mx-auto mt-4 max-w-[1440px] px-6 md:px-10">
      <div className="relative flex min-h-[500px] items-center overflow-hidden rounded-[1.8rem] border border-blue-100/50 bg-[linear-gradient(135deg,#ffffff_0%,#eff8ff_40%,#dff2ff_100%)] p-10 shadow-[0_30px_80px_rgba(14,116,144,0.12)] md:p-16 lg:min-h-[620px] lg:p-20">
        <svg aria-hidden="true" viewBox="0 0 1200 600" className="pointer-events-none absolute inset-0 h-full w-full opacity-70" preserveAspectRatio="none">
          <defs>
            <linearGradient id="heroStroke" x1="0%" x2="100%" y1="0%" y2="100%">
              <stop offset="0%" stopColor="rgba(59,130,246,0.20)" />
              <stop offset="100%" stopColor="rgba(6,182,212,0.08)" />
            </linearGradient>
          </defs>
          <path d="M0 470C164 380 275 349 420 367C580 388 668 469 824 481C974 493 1070 425 1200 312" fill="none" stroke="url(#heroStroke)" strokeWidth="3" />
          <path d="M0 540C155 460 300 428 430 443C588 462 730 553 892 544C1013 537 1099 487 1200 418" fill="none" stroke="url(#heroStroke)" strokeWidth="2" />
        </svg>
        <div className="animate-float absolute -left-12 top-20 h-32 w-32 rounded-full bg-primary-500/10 blur-3xl" />
        <div className="animate-float-delay absolute bottom-10 right-12 h-40 w-40 rounded-full bg-emerald-300/15 blur-3xl" />
        <div className="absolute right-10 top-10 hidden h-40 w-40 rounded-full border border-cyan-200/60 bg-white/40 backdrop-blur-md lg:block" />

        <div className="relative z-10 grid w-full grid-cols-1 items-center gap-12 lg:grid-cols-2">
          <div className="relative z-20 flex animate-enter-up flex-col gap-10">
            <div className="space-y-6">
              <div className="inline-flex w-fit items-center gap-2 rounded-full border border-cyan-200/80 bg-white/80 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-primary-700 shadow-soft backdrop-blur-sm">
                <Sparkles size={14} />
                {heroBadge}
              </div>
              <h1 className="text-balance text-5xl font-bold leading-[1.1] tracking-tight text-[#0f172a] md:text-6xl xl:text-7xl">
                Assistência Técnica <br />
                <span className="text-primary-600">Especializada</span> e Catálogo <br />
                de Celulares
              </h1>
              <p className="max-w-lg text-lg font-medium leading-relaxed text-slate-500 md:text-xl">
                Encontre celulares e serviços com curadoria, atendimento rápido e fluxo simples para solicitar orçamento.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link href="/catalogo" className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-600 px-6 py-4 text-sm font-black text-white shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5 hover:bg-primary-700">
                Explorar catálogo
                <ArrowRight size={18} />
              </Link>
              <Link href="/contato" className="inline-flex items-center justify-center rounded-full border border-slate-200/80 bg-white/85 px-6 py-4 text-sm font-bold text-slate-700 transition-all hover:border-primary-200 hover:text-primary-600">
                Falar com atendimento
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[1.4rem] border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Resposta</p>
                <p className="mt-2 text-3xl font-bold text-[#0f172a]">{heroResponseTime}</p>
                <p className="mt-1 text-sm text-slate-500">Fluxo pensado para retorno rápido.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Catálogo</p>
                <p className="mt-2 text-3xl font-bold text-[#0f172a]">100+</p>
                <p className="mt-1 text-sm text-slate-500">Modelos sincronizados do marketplace.</p>
              </div>
              <div className="rounded-[1.4rem] border border-white/80 bg-white/75 p-4 shadow-soft backdrop-blur-sm">
                <p className="text-[11px] font-black uppercase tracking-[0.28em] text-slate-400">Operação</p>
                <p className="mt-2 text-3xl font-bold text-[#0f172a]">1</p>
                <p className="mt-1 text-sm text-slate-500">Canal único entre vitrine e orçamento.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/90 px-5 py-3 shadow-sm transition-transform hover:scale-105">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
                  <ShieldCheck size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Catálogo Atualizado</span>
                  <span className="text-[10px] font-medium text-slate-500">Modelos sincronizados para orçamento</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/90 px-5 py-3 shadow-sm transition-transform hover:scale-105">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                  <Zap size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Atendimento Rápido</span>
                  <span className="text-[10px] font-medium text-slate-500">Suporte especializado</span>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white/90 px-5 py-3 shadow-sm transition-transform hover:scale-105">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600">
                  <Lock size={18} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-900">Acesso Seguro</span>
                  <span className="text-[10px] font-medium text-slate-500">Área restrita para clientes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative hidden h-full min-h-[400px] items-center justify-center lg:flex animate-enter-up [animation-delay:140ms]">
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex w-[120%] -translate-x-1/2 -translate-y-1/2 items-center justify-center gap-4">
              <div className="animate-float-delay relative h-[340px] w-[160px] rotate-[-12deg] overflow-hidden rounded-[1.8rem] border-4 border-white bg-[linear-gradient(180deg,#eff8ff_0%,#d9efff_100%)] opacity-60 shadow-2xl xl:h-[400px] xl:w-[190px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_52%)]" />
              </div>
              <div className="animate-float relative z-10 h-[420px] w-[220px] rotate-[-6deg] overflow-hidden rounded-[2.4rem] border-4 border-white bg-[linear-gradient(180deg,#f8fdff_0%,#dbefff_100%)] shadow-2xl xl:h-[500px] xl:w-[250px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_55%)]" />
                <div className="absolute inset-x-6 top-5 h-6 rounded-full bg-slate-900/85" />
                <div className="absolute inset-x-5 bottom-6 top-16 rounded-[2rem] bg-[linear-gradient(160deg,rgba(15,23,42,0.05),rgba(56,189,248,0.10),rgba(255,255,255,0.85))]">
                  <div className="absolute left-6 top-6 rounded-full bg-white/85 px-3 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-primary-700">
                    Orçamento
                  </div>
                  <div className="absolute bottom-8 left-6 right-6 space-y-3">
                    <div className="h-3 w-24 rounded-full bg-white/90" />
                    <div className="h-3 w-36 rounded-full bg-white/75" />
                    <div className="h-12 rounded-[1.2rem] bg-white/85 shadow-soft" />
                  </div>
                </div>
              </div>
              <div className="animate-float-delay relative h-[340px] w-[160px] rotate-6 overflow-hidden rounded-[1.8rem] border-4 border-white bg-[linear-gradient(180deg,#fefefe_0%,#ebf5ff_100%)] opacity-60 shadow-2xl xl:h-[400px] xl:w-[190px]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff,transparent_54%)]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
