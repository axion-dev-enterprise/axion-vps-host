import { SidebarFilters } from "@/components/catalogo/SidebarFilters";
import { ProductCard } from "@/components/catalogo/ProductCard";
import { getVpsPlans } from "@/lib/api/vps";
import { fallbackPlans, marketplaceBenefits } from "@/lib/vps-content";

export const dynamic = "force-dynamic";

export default async function MarketplacePage() {
  const plans = await getVpsPlans()
    .then((response) => response.data)
    .catch(() => fallbackPlans);

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Marketplace</p>
        <h1 className="mt-2 text-4xl font-semibold text-text-strong">Planos VPS para compra</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-soft">
          O catálogo antigo foi substituído por um marketplace de hospedagem com foco em performance, segurança e deploy profissional.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {marketplaceBenefits.map((item) => (
          <article key={item.title} className="glass-card rounded-[1.8rem] border border-white/10 p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
              <item.icon size={18} />
            </div>
            <h2 className="mt-4 text-xl font-semibold text-white">{item.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-text-soft">{item.copy}</p>
          </article>
        ))}
      </section>

      <div className="flex flex-col gap-6 xl:flex-row">
        <SidebarFilters brands={[]} />
        <div className="min-w-0 flex-1 space-y-6">
          {plans.map((plan, index) => (
            <ProductCard
              key={plan.id}
              product={{
                ...plan,
                badge: index === 0 ? "Launch" : index === 1 ? "Best value" : "High scale",
                isFeatured: index === 0,
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
