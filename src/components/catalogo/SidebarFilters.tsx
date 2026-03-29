import Link from "next/link";

type SidebarFiltersProps = {
  brands: string[];
  selectedQuery?: string;
  selectedBrand?: string;
};

export function SidebarFilters({ brands, selectedQuery, selectedBrand }: SidebarFiltersProps) {
  return (
    <aside className="w-full shrink-0 space-y-8 md:w-[280px]">
      <div className="space-y-4">
        <h3 className="text-sm font-black uppercase tracking-widest text-text-soft">Categoria</h3>
        <div className="rounded-2xl bg-primary-soft p-4 text-sm font-bold text-primary-700 shadow-soft">
          Smartphones
        </div>
      </div>

      <form className="space-y-6 rounded-[2rem] bg-bg-surface p-6 shadow-soft" action="/catalogo">
        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-text-soft" htmlFor="q">
            Busca
          </label>
          <input
            id="q"
            name="q"
            defaultValue={selectedQuery || ""}
            placeholder="Ex: iPhone, Galaxy, Redmi"
            className="h-12 w-full rounded-2xl border border-border-soft bg-bg-muted px-4 text-sm font-medium text-text-body outline-none transition-all focus:border-primary-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-black uppercase tracking-widest text-text-soft" htmlFor="brand">
            Marca
          </label>
          <select
            id="brand"
            name="brand"
            defaultValue={selectedBrand || ""}
            className="h-12 w-full rounded-2xl border border-border-soft bg-bg-muted px-4 text-sm font-medium text-text-body outline-none transition-all focus:border-primary-500"
          >
            <option value="">Todas</option>
            {brands.map((brand) => (
              <option key={brand} value={brand}>
                {brand}
              </option>
            ))}
          </select>
        </div>

        <button className="w-full rounded-2xl bg-primary-600 py-4 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-700 hover:shadow-card active:scale-[0.98]">
          Buscar celulares
        </button>

        <Link
          href="/catalogo"
          className="block text-center text-xs font-black uppercase tracking-widest text-text-soft transition-colors hover:text-text-strong"
        >
          Limpar filtros
        </Link>
      </form>

      <Link
        href="/contato"
        className="block w-full rounded-2xl bg-bg-muted py-4 text-center text-sm font-bold text-text-strong transition-all hover:bg-bg-surface hover:shadow-soft"
      >
        Falar com atendimento
      </Link>
    </aside>
  );
}
