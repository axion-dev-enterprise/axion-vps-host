"use client";

import Link from "next/link";
import { Search } from "lucide-react";

const quickSearches = ["Samsung", "iPhone", "Motorola", "Xiaomi", "Galaxy", "Redmi", "Mais vendidos"];

export function SearchSection() {
  return (
    <section className="relative z-20 mx-auto mt-[-3rem] max-w-[1200px] px-6">
      <div className="rounded-[1.8rem] border border-slate-100/80 bg-white/92 p-8 shadow-[0_30px_70px_rgba(15,23,42,0.08)] backdrop-blur-md">
        <form className="flex flex-col gap-6" action="/catalogo">
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-8 text-slate-400">
              <Search size={28} />
            </div>
            <input
              type="text"
              name="q"
              placeholder="Buscar no catálogo de celulares..."
              className="h-20 w-full rounded-[1.2rem] bg-[linear-gradient(180deg,#f8fbff_0%,#f2f7fc_100%)] pl-20 pr-40 text-xl font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-primary-50"
            />
            <button
              type="submit"
              className="absolute right-3 flex h-14 items-center gap-2 rounded-xl bg-primary-600 px-10 text-lg font-bold text-white shadow-lg shadow-primary-600/20 transition-all hover:-translate-y-0.5 hover:bg-primary-700 active:scale-95"
            >
              <Search size={20} />
              <span>Buscar</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-3 px-2">
            <span className="mr-2 text-sm font-bold text-slate-400">Buscas rápidas:</span>
            {quickSearches.map((tag) => (
              <Link
                key={tag}
                href={`/catalogo?q=${encodeURIComponent(tag)}`}
                className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-2 text-sm font-bold text-slate-600 transition-all hover:-translate-y-0.5 hover:bg-primary-50 hover:text-primary-600"
              >
                {tag}
              </Link>
            ))}
          </div>
        </form>
      </div>
    </section>
  );
}
