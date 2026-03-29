"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, ShieldCheck, X } from "lucide-react";

import { cn } from "@/lib/utils";

const navLinks = [
  { name: "Catalogo", href: "/catalogo" },
  { name: "Servicos", href: "/servicos" },
  { name: "Depoimentos", href: "/depoimentos" },
  { name: "Contato", href: "/contato" },
  { name: "Admin", href: "/admin" },
] as const;

export function Topbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border-soft/80 bg-white/80 backdrop-blur-xl">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-10">
        <Link href="/" className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-2xl border border-primary-200 bg-white shadow-soft">
            <Image src="/logopontotec.png" alt="Logo PontoTecc" width={48} height={48} className="h-full w-full object-cover" priority />
          </div>
          <div>
            <p className="text-[11px] font-black uppercase tracking-[0.28em] text-primary-600">PONTOTECC</p>
            <p className="text-lg font-black text-text-strong">Celulares e Assistencia</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm font-bold text-text-soft transition-colors hover:text-text-strong">
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-primary-200 bg-primary-soft px-4 py-2 text-xs font-bold text-primary-700 md:flex">
            <ShieldCheck size={14} />
            Orcamento rapido e atendimento real
          </div>

          <Link
            href="/contato"
            className="hidden rounded-full bg-primary-600 px-5 py-3 text-sm font-black text-white shadow-[0_18px_48px_rgba(37,99,235,0.18)] transition-all hover:-translate-y-0.5 hover:bg-primary-700 md:inline-flex"
          >
            Solicitar orcamento
          </Link>

          <button
            type="button"
            onClick={() => setIsMenuOpen((current) => !current)}
            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-border-soft text-text-strong lg:hidden"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "border-t border-border-soft bg-white/95 px-6 transition-all duration-300 lg:hidden",
          isMenuOpen ? "max-h-[80vh] py-6 opacity-100" : "pointer-events-none max-h-0 overflow-hidden py-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-3">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMenuOpen(false)}
              className="rounded-2xl border border-border-soft bg-bg-surface px-5 py-4 text-sm font-bold text-text-strong"
            >
              {link.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
