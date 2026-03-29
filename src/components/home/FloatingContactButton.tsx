"use client";

import Link from "next/link";
import { MessageCircleMore } from "lucide-react";

export function FloatingContactButton() {
  return (
    <Link
      href="/contato"
      className="fixed bottom-5 right-5 z-50 inline-flex items-center gap-3 rounded-full bg-[#0f172a] px-5 py-4 text-sm font-black text-white shadow-[0_18px_45px_rgba(15,23,42,0.3)] transition-all hover:-translate-y-1 hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary-200"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/12">
        <MessageCircleMore size={18} />
      </span>
      Solicitar orçamento
    </Link>
  );
}
