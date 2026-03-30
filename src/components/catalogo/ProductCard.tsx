import Link from "next/link";
import type { VpsPlan } from "@/lib/api/vps";
import { ArrowRight, Cpu, Globe, HardDrive, Shield } from "lucide-react";

import { PhoneImage } from "@/components/catalogo/PhoneImage";
import { cn, formatCurrency } from "@/lib/utils";

type Product = VpsPlan & {
  badge?: string;
  isFeatured?: boolean;
};

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article
      className={cn(
        "glass-card group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/10 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-cyan-400/20",
        product.isFeatured ? "lg:flex-row lg:items-center lg:gap-8" : "",
      )}
    >
      {product.badge ? (
        <span className="absolute right-5 top-5 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-cyan-300">
          {product.badge}
        </span>
      ) : null}

      <div className={cn(product.isFeatured ? "lg:w-[320px] lg:shrink-0" : "") }>
        <PhoneImage alt={product.name} featured={Boolean(product.isFeatured)} />
      </div>

      <div className={cn("flex flex-1 flex-col", product.isFeatured ? "mt-6 lg:mt-0" : "mt-6") }>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-cyan-300">{product.name}</p>
            <h3 className="mt-2 text-3xl font-semibold text-text-strong">{formatCurrency(product.priceMonthlyCents)}</h3>
            <p className="mt-1 text-sm text-text-soft">{formatCurrency(product.priceYearlyCents)}/mês no anual</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-right">
            <p className="text-[11px] uppercase tracking-[0.24em] text-text-soft">Provisiona em</p>
            <p className="mt-1 font-semibold text-white">{product.setupMinutes}</p>
          </div>
        </div>

        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-text-body">{product.subtitle}</p>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Spec icon={Cpu} label={`${product.resources.cpu} vCPU`} />
          <Spec icon={HardDrive} label={product.resources.volume} />
          <Spec icon={Shield} label={product.resources.ram} />
          <Spec icon={Globe} label={product.resources.location} />
        </div>

        <ul className="mt-6 space-y-3 text-sm text-slate-300">
          {product.highlights.map((item) => (
            <li key={item} className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#00ff88]" />
              {item}
            </li>
          ))}
        </ul>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
          <p className="max-w-xl text-sm text-text-soft">{product.audience}</p>
          <Link
            href={`/checkout?plan=${product.id}`}
            className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Contratar plano
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, label }: { icon: typeof Cpu; label: string }) {
  return (
    <div className="rounded-[1.4rem] border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
      <div className="flex items-center gap-2 text-cyan-300">
        <Icon size={16} />
        <span className="font-medium">{label}</span>
      </div>
    </div>
  );
}
