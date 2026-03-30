"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { Bell, CreditCard, LayoutDashboard, Menu, Server, Shield, ShoppingBag, UserRound, X } from "lucide-react";
import { useState } from "react";

import { AuthStatus } from "@/components/auth/AuthStatus";
import { cn } from "@/lib/utils";

const appNavItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/servers", label: "Meus servidores", icon: Server },
  { href: "/marketplace", label: "Marketplace", icon: ShoppingBag },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/admin", label: "Admin", icon: Shield },
] as const;

const marketingNav = [
  { href: "/marketplace", label: "Planos" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/admin", label: "Admin" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");
  const isAppPage = pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-bg-app text-text-body">
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center gap-10 px-4 py-10 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div className="max-w-xl space-y-6">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Secure access</p>
            <h2 className="text-5xl font-semibold leading-tight text-white">Separação total entre landing pública, painel do cliente e console admin.</h2>
            <p className="text-lg leading-relaxed text-text-soft">
              A autenticação usa cookie httpOnly, as rotas sensíveis passam pelo middleware do Next.js e o design dark continua intacto.
            </p>
            <div className="grid gap-4 sm:grid-cols-3">
              <FeaturePill title="Landing" copy="Pública para conversão" />
              <FeaturePill title="Dashboard" copy="Protegido para clientes" />
              <FeaturePill title="Admin" copy="Role admin obrigatória" />
            </div>
          </div>
          <div className="flex w-full justify-center">{children}</div>
        </div>
      </div>
    );
  }

  if (!isAppPage) {
    return (
      <div className="min-h-screen bg-bg-app text-text-body">
        <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(10,10,10,0.72)] backdrop-blur-xl">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
            <Link href="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[linear-gradient(180deg,rgba(0,212,255,0.18),rgba(255,255,255,0.02))] text-cyan-300 shadow-[0_0_30px_rgba(0,212,255,0.12)]">
                <Server size={22} />
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">AXION</p>
                <p className="text-base font-semibold text-white">VPS Host</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 md:flex">
              {marketingNav.map((item) => (
                <Link key={item.href} href={item.href} className="text-sm text-slate-300 transition hover:text-white">
                  {item.label}
                </Link>
              ))}
            </nav>

            <AuthStatus />
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    );
  }

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
            <button type="button" onClick={() => setOpen(false)} className="inline-flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white">
              <X size={18} />
            </button>
          </div>

          <div className="hidden lg:block">
            <Brand />
          </div>

          <div className="mt-8 rounded-[28px] border border-white/10 bg-white/5 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.35)]">
            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-cyan-300">Access layer</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-3 w-3 rounded-full bg-[#00ff88] shadow-[0_0_12px_rgba(0,255,136,0.85)]" />
              <div>
                <p className="font-semibold text-white">Sessão protegida por cookie httpOnly</p>
                <p className="text-sm text-slate-400">Middleware ativo para dashboard e admin</p>
              </div>
            </div>
          </div>

          <nav className="mt-8 space-y-2">
            {appNavItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
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
              <p className="text-sm font-semibold">Separação de acesso</p>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Landing pública, dashboard do cliente e console admin agora vivem em fluxos distintos.
            </p>
          </div>
        </aside>

        <div className="min-w-0 flex-1 lg:pl-[280px]">
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(10,10,10,0.72)] backdrop-blur-xl">
            <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setOpen(true)} className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white lg:hidden">
                  <Menu size={18} />
                </button>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-cyan-300">AXION VPS HOST</p>
                  <p className="text-sm text-slate-400">{pathname.startsWith("/admin") ? "Console administrativo" : "Área autenticada do cliente"}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300 md:flex md:items-center md:gap-2">
                  <Bell size={14} className="text-cyan-300" />
                  Acesso segregado ativo
                </div>
                <AuthStatus />
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
    <Link href="/dashboard" className="flex items-center gap-3">
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

function FeaturePill({ title, copy }: { title: string; copy: string }) {
  return (
    <article className="rounded-[1.6rem] border border-white/10 bg-white/5 p-4">
      <p className="text-sm font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm text-text-soft">{copy}</p>
    </article>
  );
}
