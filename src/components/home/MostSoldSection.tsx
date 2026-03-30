import { ProductCard } from "@/components/catalogo/ProductCard";
import { getVpsPlans } from "@/lib/api/vps";
import { fallbackPlans } from "@/lib/vps-content";

export async function MostSoldSection() {
  const products = await getVpsPlans()
    .then((response) => response.data)
    .catch(() => fallbackPlans);

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Featured plans</p>
          <h2 className="mt-2 text-3xl font-semibold text-text-strong md:text-4xl">Planos VPS em destaque</h2>
        </div>
        <p className="max-w-2xl text-sm leading-relaxed text-text-soft">
          Catálogo otimizado para hosting profissional, com planos prontos para operação, billing e automação.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {products.slice(0, 3).map((product, index) => (
          <ProductCard
            key={product.id}
            product={{
              ...product,
              badge: index === 0 ? "Mais vendido" : index === 1 ? "Escala" : "Enterprise",
              isFeatured: index === 0,
            }}
          />
        ))}
      </div>
    </section>
  );
}
