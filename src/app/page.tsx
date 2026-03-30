import Link from "next/link";
import { ArrowRight, Check, CreditCard, Rocket, ShieldCheck, Star, Zap } from "lucide-react";

import { ProductCard } from "@/components/catalogo/ProductCard";
import { getVpsPlans } from "@/lib/api/vps";
import { fallbackPlans } from "@/lib/vps-content";

export const dynamic = "force-dynamic";

const testimonials = [
  {
    name: "Marina Lopes",
    company: "Studio Commerce",
    quote: "Migramos o stack para AXION e ganhamos previsibilidade, deploy rápido e suporte humano de verdade.",
  },
  {
    name: "Rafael Nunes",
    company: "Cloud Ops Squad",
    quote: "A combinação de VPS + painel + billing em um só fluxo reduz muito o tempo de operação do time.",
  },
  {
    name: "Isabela Costa",
    company: "Agência Delta",
    quote: "A landing vende bem porque fica claro o valor: performance, proteção e onboarding guiado.",
  },
];

const features = [
  "Provisionamento rápido com planos prontos para produção",
  "Firewall, snapshots e postura operacional desde o primeiro deploy",
  "Dashboard do cliente com métricas, servidores e faturamento",
  "Console admin separado para operação completa da carteira",
];

const priceHighlights = [
  { label: "Setup médio", value: "5-15 min" },
  { label: "Uptime agregado", value: "99,98%" },
  { label: "Suporte", value: "Humano + operacional" },
];

export default async function HomePage() {
  const plans = await getVpsPlans()
    .then((response) => response.data)
    .catch(() => fallbackPlans);

  return (
    <div className="space-y-8 pb-6">
      <section className="overflow-hidden rounded-[2.4rem] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(0,212,255,0.22),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-6 md:p-10">
        <div className="grid gap-10 xl:grid-cols-[1.1fr_0.9fr] xl:items-center">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-cyan-300">Landing page pública</p>
            <h1 className="mt-4 max-w-4xl text-5xl font-semibold leading-tight text-white md:text-6xl">
              VPS profissional com painel premium, onboarding rápido e acesso separado para cliente e admin.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-slate-300">
              Venda infraestrutura como produto: landing para conversão, marketplace para escolha do plano e dashboard protegido para operação do cliente.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
                Escolher plano
                <ArrowRight size={16} />
              </Link>
              <Link href="/login" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10">
                Login
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {features.map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-[1.4rem] border border-white/10 bg-white/5 px-4 py-4">
                  <Check size={18} className="mt-0.5 text-emerald-300" />
                  <p className="text-sm text-slate-200">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="glass-card rounded-[2rem] border border-white/10 p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Oferta em destaque</p>
              <div className="mt-5 grid gap-4 md:grid-cols-3 xl:grid-cols-1">
                {priceHighlights.map((item) => (
                  <article key={item.label} className="rounded-[1.4rem] border border-white/10 bg-white/5 p-5">
                    <p className="text-sm text-text-soft">{item.label}</p>
                    <p className="mt-3 text-3xl font-semibold text-white">{item.value}</p>
                  </article>
                ))}
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
              <MiniCard icon={Rocket} title="Deploy acelerado" copy="Templates prontos para sites, automações, APIs e stacks com Docker." />
              <MiniCard icon={ShieldCheck} title="Segurança nativa" copy="Cookies httpOnly, middleware e segregação real entre cliente e admin." />
              <MiniCard icon={CreditCard} title="Billing integrado" copy="Faturas, upgrades e pagamento guiado no mesmo ecossistema." />
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Marketplace preview</p>
            <h2 className="mt-2 text-4xl font-semibold text-white">Planos em destaque</h2>
            <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-soft">
              Mostre os planos mais vendáveis na landing e envie o usuário direto para o marketplace completo quando ele estiver pronto para comprar.
            </p>
          </div>
          <Link href="/marketplace" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
            Ver todos os planos
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-3">
          {plans.slice(0, 3).map((plan, index) => (
            <ProductCard
              key={plan.id}
              product={{
                ...plan,
                badge: index === 0 ? "Mais rápido" : index === 1 ? "Melhor custo" : "Escala alta",
                isFeatured: index === 1,
              }}
            />
          ))}
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="glass-card rounded-[2rem] border border-white/10 p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Por que converte</p>
          <h2 className="mt-2 text-3xl font-semibold text-white">Clareza de produto, operação e segurança.</h2>
          <div className="mt-6 grid gap-4">
            <Reason icon={Zap} title="Performance" copy="Planos objetivos, benchmark comercial forte e CTA direto para compra." />
            <Reason icon={ShieldCheck} title="Confiança" copy="Separação entre área pública, painel do cliente e administração protegida." />
            <Reason icon={Star} title="Experiência" copy="Design dark premium sem sacrificar navegação nem onboarding." />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {testimonials.map((item) => (
            <article key={item.name} className="glass-card rounded-[2rem] border border-white/10 p-5">
              <div className="flex items-center gap-1 text-amber-300">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={`${item.name}-${index}`} size={16} fill="currentColor" />
                ))}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-200">“{item.quote}”</p>
              <div className="mt-6">
                <p className="font-semibold text-white">{item.name}</p>
                <p className="text-sm text-text-soft">{item.company}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}

function MiniCard({ icon: Icon, title, copy }: { icon: typeof Rocket; title: string; copy: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
        <Icon size={18} />
      </div>
      <h3 className="mt-4 text-lg font-semibold text-white">{title}</h3>
      <p className="mt-2 text-sm text-text-soft">{copy}</p>
    </article>
  );
}

function Reason({ icon: Icon, title, copy }: { icon: typeof Rocket; title: string; copy: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-5">
      <div className="flex items-center gap-3 text-cyan-300">
        <Icon size={18} />
        <h3 className="text-lg font-semibold text-white">{title}</h3>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-text-soft">{copy}</p>
    </article>
  );
}
