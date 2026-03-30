"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import {
  Bell,
  CreditCard,
  LayoutDashboard,
  Menu,
  Settings,
  ShoppingBag,
  Shield,
  Server,
  X,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/servers", label: "Servidores", icon: Server },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/billing", label: "Billing", icon: CreditCard },
  { href: "/admin", label: "Admin", icon: Settings },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-bg-app text-text-body">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-[280px] border-r border-white/10 bg-[rgba(8,10,18,0.92)] px-5 py-6 backdrop-blur-xl transition-transform lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex items-center justify-between lg:hidden">
            <Brand />
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
            >
              <X size={18} />
            </button>
          </div>

          <div className="hidden lg:block">
            <Brand />
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Infra status</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.85)]" />
              <div>
                <p className="font-semibold text-white">Todos os POPs monitorados</p>
                <p className="text-sm text-slate-400">Última sincronização há 42 segundos</p>
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {navItems.map((item) => {
              const active = item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-cyan-400/10 text-cyan-300 shadow-[inset_0_0_0_1px_rgba(0,212,255,0.18)]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white",
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-8 rounded-[28px] border border-cyan-400/10 bg-[linear-gradient(180deg,rgba(0,212,255,0.10),rgba(255,255,255,0.02))] p-5">
            <div className="flex items-center gap-3 text-cyan-300">
              <Shield size={18} />
              <p className="text-sm font-semibold">Modo protegido</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Firewall, snapshots e trilha de auditoria ativos para todas as instâncias listadas.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-[280px]">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(10,10,10,0.72)] backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setOpen(true)}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden"
                >
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">AXION VPS HOST</p>
                  <p className="text-sm text-slate-400">Painel operacional de infraestrutura</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:flex md:items-center md:gap-2">
                  <Bell size={14} className="text-cyan-300" />
                  3 alertas ativos
                </div>
                <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                  Ops Team
                </div>
              </div>
            </div>
          </header>

          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>

      {open ? <button type="button" aria-label="close overlay" className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setOpen(false)} /> : null}
    </div>
  );
}

function Brand() {
  return (
    <Link href="/" className="flex items-center gap-3">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(0,212,255,0.18),rgba(255,255,255,0.02))] text-cyan-300 shadow-[0_0_30px_rgba(0,212,255,0.12)]">
        <Server size={22} />
      </div>
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">AXION</p>
        <p className="text-base font-semibold text-white">VPS Host Panel</p>
      </div>
    </Link>
  );
}
