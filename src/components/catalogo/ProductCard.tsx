import Link from "next/link";
import type { Phone } from "@pontotecc/contract";

import { PhoneImage } from "@/components/catalogo/PhoneImage";
import { cn } from "@/lib/utils";

interface Product extends Phone {
  badge?: string;
  isFeatured?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const title = `${product.brand} ${product.model}`;
  const variant = `${product.storageGb}GB`;

  return (
    <div
      className={cn(
        "group relative flex flex-col rounded-[2.5rem] border border-white/80 bg-bg-surface p-8 shadow-soft transition-all duration-500 hover:-translate-y-2 hover:shadow-hover",
        product.isFeatured ? "col-span-1 items-center gap-12 md:col-span-2 lg:col-span-3 lg:flex-row" : "",
      )}
    >
      {product.badge ? (
        <span className="absolute left-8 top-8 z-10 rounded-full bg-primary-soft px-4 py-1.5 text-xs font-bold text-primary-700">
          {product.badge}
        </span>
      ) : null}

      <div
        className={cn(
          "relative flex items-center justify-center overflow-hidden transition-transform duration-500 group-hover:scale-105",
          product.isFeatured ? "h-[320px] w-1/3 shrink-0" : "h-[240px] w-full",
        )}
      >
        <PhoneImage
          imageUrl={product.imageUrl}
          alt={title}
          featured={Boolean(product.isFeatured)}
          priority={Boolean(product.isFeatured)}
        />
      </div>

      <div className={cn("flex flex-col gap-4", product.isFeatured ? "flex-1" : "mt-6 text-center")}>
        <div className="space-y-1">
          <h3 className={cn("font-bold tracking-tight text-text-strong", product.isFeatured ? "text-4xl" : "text-xl")}>
            {title}
          </h3>
          <p className={cn("font-medium text-text-soft", product.isFeatured ? "text-2xl" : "text-sm")}>{variant}</p>
        </div>

        <p className="text-sm font-black uppercase tracking-[0.2em] text-primary-700">Solicitar Orçamento</p>

        {product.isFeatured ? (
          <p className="max-w-md text-lg leading-relaxed text-text-body">
            {product.shortDescription || "Consulte disponibilidade e detalhes deste modelo com nosso atendimento."}
          </p>
        ) : null}

        <Link
          href={`/contato?produto=${encodeURIComponent(title)}`}
          className={cn(
            "inline-flex items-center justify-center rounded-full bg-primary-600 font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-card active:scale-95",
            product.isFeatured ? "w-fit px-12 py-5 text-xl" : "mt-2 w-full py-4 text-sm",
          )}
        >
          Solicitar Orçamento
        </Link>
      </div>
    </div>
  );
}
