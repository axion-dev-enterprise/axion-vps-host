import { listPhonesQuerySchema } from "@pontotecc/contract";

import { ProductCard } from "@/components/catalogo/ProductCard";
import { SidebarFilters } from "@/components/catalogo/SidebarFilters";
import { Topbar } from "@/components/layout/Topbar";
import { getPhonesCatalog } from "@/lib/api/catalog";

export const dynamic = "force-dynamic";

type CatalogoPageProps = {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

function normalizeSearchParams(input?: Record<string, string | string[] | undefined>) {
  if (!input) {
    return {};
  }

  return Object.fromEntries(
    Object.entries(input).map(([key, value]) => [key, Array.isArray(value) ? value[0] : value]),
  );
}

export default async function CatalogoPage({ searchParams }: CatalogoPageProps) {
  const resolvedSearchParams = normalizeSearchParams(await searchParams);
  const parsed = listPhonesQuerySchema.safeParse(resolvedSearchParams);
  const query = parsed.success ? parsed.data : listPhonesQuerySchema.parse({});
  const result = await getPhonesCatalog(query);
  const products = result.data;
  const featuredProduct = products[0];
  const remainingProducts = products.slice(1);

  return (
    <main className="min-h-screen bg-bg-app pb-20 font-sans">
      <Topbar />

      <div className="mx-auto mt-8 max-w-[1440px] px-6 md:px-10">
        <div className="flex flex-col gap-10 md:flex-row lg:gap-16">
          <SidebarFilters
            brands={result.meta.availableBrands}
            selectedQuery={query.q}
            selectedBrand={query.brand}
          />

          <div className="flex-1 space-y-10">
            <div className="space-y-2">
              <p className="text-sm font-black uppercase tracking-widest text-primary-700">
                Catálogo conectado ao backend
              </p>
              <h1 className="text-4xl font-black tracking-tight text-text-strong md:text-5xl">
                Modelos disponíveis agora
              </h1>
              <p className="text-base text-text-soft">
                {result.meta.total} aparelho(s) sincronizado(s) do marketplace e prontos para orçamento.
              </p>
            </div>

            {products.length > 0 ? (
              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                {featuredProduct ? (
                  <ProductCard
                    product={{
                      ...featuredProduct,
                      badge: "Destaque",
                      isFeatured: true,
                    }}
                  />
                ) : null}

                {remainingProducts.map((product, index) => (
                  <ProductCard
                    key={product.id}
                    product={{
                      ...product,
                      badge: index === 0 ? "Mais buscado" : undefined,
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="rounded-[2rem] bg-bg-surface p-10 text-center shadow-soft">
                <h2 className="text-2xl font-black text-text-strong">Nenhum modelo encontrado</h2>
                <p className="mt-3 text-text-soft">
                  Ajuste a busca ou fale com o atendimento para receber opções semelhantes.
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 gap-8 border-t border-border-soft pt-10 md:grid-cols-3">
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
                  API
                </div>
                <h4 className="font-bold text-text-strong">Estoque atualizado</h4>
                <p className="text-sm text-text-soft">
                  Listagem servida pelo backend com dados persistidos e sincronizados do marketplace.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 font-bold text-purple-600">
                  {result.meta.availableBrands.length}
                </div>
                <h4 className="font-bold text-text-strong">Marcas disponíveis</h4>
                <p className="text-sm text-text-soft">Filtro alimentado pelas marcas retornadas na API.</p>
              </div>
              <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-cyan-100 font-bold text-cyan-600">
                  {result.meta.total}
                </div>
                <h4 className="font-bold text-text-strong">Consulta simples</h4>
                <p className="text-sm text-text-soft">
                  Selecione o modelo e siga para atendimento sem depender de mocks.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
