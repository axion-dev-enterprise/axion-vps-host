"use client";

import { useMemo, useState } from "react";
import { Edit3, Save, Trash2, X } from "lucide-react";

import type { AdminProduct } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

type ProductListProps = {
  products: AdminProduct[];
  onCreate(input: Omit<AdminProduct, "id" | "importedAt">): Promise<void>;
  onUpdate(id: string, input: Omit<AdminProduct, "id" | "importedAt">): Promise<void>;
  onDelete(id: string): Promise<void>;
};

type ProductFormState = {
  brand: string;
  model: string;
  storageGb: string;
  imageUrl: string;
  shortDescription: string;
};

const emptyForm: ProductFormState = {
  brand: "",
  model: "",
  storageGb: "128",
  imageUrl: "",
  shortDescription: "",
};

export function ProductList({ products, onCreate, onUpdate, onDelete }: ProductListProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductFormState>(emptyForm);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    if (!normalized) {
      return products;
    }

    return products.filter((product) => `${product.brand} ${product.model}`.toLowerCase().includes(normalized));
  }, [products, search]);

  function fillFromProduct(product: AdminProduct) {
    setForm({
      brand: product.brand,
      model: product.model,
      storageGb: String(product.storageGb),
      imageUrl: product.imageUrl ?? "",
      shortDescription: product.shortDescription ?? "",
    });
  }

  function resetForm() {
    setIsCreating(false);
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleCreate() {
    await onCreate({
      brand: form.brand.trim(),
      model: form.model.trim(),
      storageGb: Number(form.storageGb),
      imageUrl: form.imageUrl.trim() || undefined,
      shortDescription: form.shortDescription.trim() || undefined,
      quoteOnly: true,
    });

    resetForm();
  }

  async function handleUpdate(id: string) {
    await onUpdate(id, {
      brand: form.brand.trim(),
      model: form.model.trim(),
      storageGb: Number(form.storageGb),
      imageUrl: form.imageUrl.trim() || undefined,
      shortDescription: form.shortDescription.trim() || undefined,
      quoteOnly: true,
    });

    resetForm();
  }

  return (
    <div className="overflow-hidden rounded-[2.5rem] border border-border-soft bg-bg-surface shadow-card">
      <div className="flex flex-col gap-4 border-b border-border-soft p-8 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-xl font-black text-text-strong">Gestão de Catálogo</h3>
          <p className="text-sm text-text-soft">CRUD real conectado ao banco e ao catálogo publicado.</p>
        </div>
        <div className="flex flex-col gap-3 md:flex-row">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar produto..."
            className="h-11 rounded-xl border border-border-soft bg-bg-muted/30 px-4 text-sm outline-none transition-all focus:ring-4 focus:ring-primary-soft"
          />
          <button
            type="button"
            onClick={() => {
              setIsCreating(true);
              setEditingId(null);
              setForm(emptyForm);
            }}
            className="rounded-xl bg-primary-600 px-6 py-2 text-sm font-bold text-white shadow-soft transition-all hover:bg-primary-700"
          >
            + Novo Produto
          </button>
        </div>
      </div>

      {(isCreating || editingId) && (
        <div className="grid gap-4 border-b border-border-soft bg-bg-muted/20 p-8 md:grid-cols-2">
          <input
            value={form.brand}
            onChange={(event) => setForm((current) => ({ ...current, brand: event.target.value }))}
            placeholder="Marca"
            className="h-12 rounded-xl border border-border-soft bg-white px-4 text-sm outline-none"
          />
          <input
            value={form.model}
            onChange={(event) => setForm((current) => ({ ...current, model: event.target.value }))}
            placeholder="Modelo"
            className="h-12 rounded-xl border border-border-soft bg-white px-4 text-sm outline-none"
          />
          <input
            value={form.storageGb}
            onChange={(event) => setForm((current) => ({ ...current, storageGb: event.target.value }))}
            placeholder="Armazenamento"
            className="h-12 rounded-xl border border-border-soft bg-white px-4 text-sm outline-none"
          />
          <input
            value={form.imageUrl}
            onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
            placeholder="URL da imagem"
            className="h-12 rounded-xl border border-border-soft bg-white px-4 text-sm outline-none"
          />
          <textarea
            value={form.shortDescription}
            onChange={(event) => setForm((current) => ({ ...current, shortDescription: event.target.value }))}
            placeholder="Descrição curta"
            className="min-h-28 rounded-xl border border-border-soft bg-white p-4 text-sm outline-none md:col-span-2"
          />
          <div className="flex gap-3 md:col-span-2">
            <button
              type="button"
              onClick={() => (editingId ? handleUpdate(editingId) : handleCreate())}
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-bold text-white"
            >
              <Save size={16} />
              {editingId ? "Salvar alterações" : "Criar produto"}
            </button>
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 rounded-xl border border-border-soft px-5 py-3 text-sm font-bold text-text-soft">
              <X size={16} />
              Cancelar
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-bg-muted/30">
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-text-soft">Produto</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-text-soft">Variação</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-text-soft">Origem</th>
              <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-text-soft">Status</th>
              <th className="px-8 py-4 text-right text-[10px] font-black uppercase tracking-widest text-text-soft">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-soft">
            {filtered.map((product) => (
              <tr key={product.id} className="group transition-colors hover:bg-bg-muted/20">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-10 items-center justify-center rounded-lg bg-bg-muted font-black text-xs text-text-soft">
                      {product.brand.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-text-strong transition-colors group-hover:text-primary-600">
                        {product.brand} {product.model}
                      </span>
                      <p className="text-xs text-text-soft">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6 text-sm font-medium text-text-soft">{product.storageGb}GB</td>
                <td className="px-8 py-6 text-sm font-medium text-text-soft">{product.importedAt ? "Sincronizado" : "Manual"}</td>
                <td className="px-8 py-6">
                  <span className={cn("rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest", product.quoteOnly ? "bg-green-50 text-green-600" : "bg-slate-100 text-slate-600")}>
                    {product.quoteOnly ? "Orçamento" : "Preço"}
                  </span>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setIsCreating(false);
                        setEditingId(product.id);
                        fillFromProduct(product);
                      }}
                      className="rounded-lg p-2 text-text-soft transition-all hover:bg-bg-muted hover:text-text-strong"
                    >
                      <Edit3 size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(product.id)}
                      className="rounded-lg p-2 text-text-soft transition-all hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
