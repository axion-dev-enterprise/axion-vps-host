import type { ReactNode } from "react";

type SidebarFiltersProps = {
  brands: string[];
  selectedQuery?: string;
  selectedBrand?: string;
};

const regions = ["São Paulo", "Miami", "Frankfurt", "Singapura"];
const systems = ["Ubuntu", "Debian", "Rocky", "Windows"];

export function SidebarFilters({ selectedQuery, selectedBrand }: SidebarFiltersProps) {
  return (
    <aside className="glass-card w-full shrink-0 rounded-[2rem] border border-white/10 p-6 md:w-[320px]">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Server filters</p>
        <h2 className="text-2xl font-semibold text-text-strong">Filtre infraestrutura</h2>
        <p className="text-sm leading-relaxed text-text-soft">Região, sistema operacional e faixa de preço para achar a VPS ideal.</p>
      </div>

      <form className="mt-6 space-y-5" action="/marketplace">
        <Field label="Busca">
          <input
            id="q"
            name="q"
            defaultValue={selectedQuery || ""}
            placeholder="Ex: Docker, WordPress, high CPU"
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none"
          />
        </Field>

        <Field label="Região">
          <select
            id="region"
            name="region"
            defaultValue={selectedBrand || ""}
            className="h-12 w-full rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none"
          >
            <option value="">Todas</option>
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Sistema operacional">
          <div className="grid grid-cols-2 gap-2">
            {systems.map((system) => (
              <label key={system} className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-3 py-3 text-sm text-slate-300">
                <input type="checkbox" name="os" value={system} className="accent-cyan-400" />
                {system}
              </label>
            ))}
          </div>
        </Field>

        <Field label="Faixa mensal">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="R$ mínimo" className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none" />
            <input placeholder="R$ máximo" className="h-12 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm text-white outline-none" />
          </div>
        </Field>

        <button className="w-full rounded-full bg-cyan-400 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300">
          Aplicar filtros
        </button>
      </form>
    </aside>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block space-y-2">
      <span className="text-xs font-semibold uppercase tracking-[0.24em] text-text-soft">{label}</span>
      {children}
    </label>
  );
}
