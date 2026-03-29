"use client";

import { useState, useTransition } from "react";
import { CircleCheck, Facebook, Instagram, Mail, MapPin, MessageCircle, Send, Smartphone } from "lucide-react";

import { createQuoteRequest } from "@/lib/api/quoteRequests";
import type { AdminSettings } from "@/lib/api/admin";
import { cn } from "@/lib/utils";

type ContatoContentProps = {
  initialProduct?: string;
  settings?: Partial<AdminSettings>;
};

const initialState = {
  name: "",
  email: "",
  phone: "",
  product: "",
  message: "",
};

export function ContatoContent({ initialProduct, settings }: ContatoContentProps) {
  const [form, setForm] = useState({
    ...initialState,
    product: initialProduct ?? "",
    message: initialProduct ? `Olá, gostaria de solicitar um orçamento para ${initialProduct}.` : "",
  });
  const [feedback, setFeedback] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const contactInfo = [
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: settings?.whatsappNumber ?? "(11) 99999-9999",
      href: settings?.whatsappUrl ?? "https://wa.me/5511999999999",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: Mail,
      label: "E-mail",
      value: settings?.supportEmail ?? "contato@pontotecc.com.br",
      href: `mailto:${settings?.supportEmail ?? "contato@pontotecc.com.br"}`,
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: MapPin,
      label: "Localização",
      value: settings?.locationLabel ?? "São Paulo, SP - Brasil",
      href: `https://www.google.com/maps/search/${encodeURIComponent(settings?.locationLabel ?? "São Paulo, SP - Brasil")}`,
      color: "bg-amber-50 text-amber-600",
    },
  ];

  function updateField<K extends keyof typeof form>(field: K, value: (typeof form)[K]) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFeedback(null);
    setError(null);

    startTransition(async () => {
      try {
        await createQuoteRequest({
          name: form.name,
          email: form.email,
          phone: form.phone,
          product: form.product || undefined,
          message: form.message,
          sourcePage: "/contato",
        });

        setFeedback("Solicitação enviada. Nosso atendimento deve retornar em breve.");
        setForm({
          ...initialState,
          product: initialProduct ?? "",
          message: initialProduct ? `Olá, gostaria de solicitar um orçamento para ${initialProduct}.` : "",
        });
      } catch (submitError) {
        setError(submitError instanceof Error ? submitError.message : "Não foi possível enviar agora.");
      }
    });
  }

  return (
    <div className="flex flex-col gap-16 py-10">
      <div className="space-y-4 text-center animate-enter-up">
        <h1 className="text-4xl font-black tracking-tight text-text-strong md:text-6xl">
          Vamos <span className="text-primary-600">conversar?</span>
        </h1>
        <p className="mx-auto max-w-2xl text-lg font-medium text-text-soft">
          Solicite orçamento, tire dúvidas sobre assistência e receba um retorno mais rápido com o modelo desejado já informado.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="space-y-8 lg:col-span-1">
          <div className="space-y-8 rounded-[2.5rem] border border-border-soft bg-bg-surface p-10 shadow-soft animate-enter-up [animation-delay:120ms]">
            <h3 className="text-xl font-black text-text-strong">Canais de Atendimento</h3>
            <div className="space-y-6">
              {contactInfo.map((info) => (
                <a key={info.label} href={info.href} target="_blank" rel="noreferrer" className="group flex items-center gap-5">
                  <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:scale-105", info.color)}>
                    <info.icon size={24} />
                  </div>
                  <div>
                    <p className="ml-0.5 text-[10px] font-black uppercase tracking-widest text-text-soft">{info.label}</p>
                    <p className="text-sm font-bold text-text-strong transition-colors group-hover:text-primary-600">{info.value}</p>
                  </div>
                </a>
              ))}
            </div>

            <div className="space-y-4 border-t border-border-soft pt-8">
              <p className="text-xs font-black uppercase tracking-widest text-text-soft">Atendimento digital</p>
              <div className="rounded-[1.75rem] bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_100%)] p-5">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary-600 text-white shadow-soft">
                    <Smartphone size={20} />
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold text-text-strong">Orçamento guiado</p>
                    <p className="text-sm text-text-soft">Recebemos o modelo, contato e mensagem para responder com disponibilidade e condições.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4 border-t border-border-soft pt-8">
              <p className="text-xs font-black uppercase tracking-widest text-text-soft">Siga-nos</p>
              <div className="flex gap-4">
                {[
                  { href: settings?.instagramUrl ?? "https://instagram.com/pontotecc", icon: Instagram },
                  { href: settings?.facebookUrl ?? "https://facebook.com/pontotecc", icon: Facebook },
                ].map((item, index) => (
                  <a
                    key={index}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-10 w-10 items-center justify-center rounded-xl bg-bg-muted text-text-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-600 hover:text-white"
                  >
                    <item.icon size={20} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 rounded-[2.5rem] bg-primary-600 p-10 text-white shadow-card animate-enter-up [animation-delay:180ms]">
            <h4 className="text-xl font-black">Horário de Funcionamento</h4>
            <div className="space-y-2 text-sm font-medium opacity-90">
              <p>Segunda a Sexta: 09h às 18h</p>
              <p>Sábado: 09h às 13h</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 animate-enter-up [animation-delay:220ms]">
          <div className="h-full rounded-[3rem] border border-border-soft bg-bg-surface p-10 shadow-card md:p-16">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-2 text-xs font-black uppercase tracking-widest text-text-soft">Nome completo</label>
                  <input type="text" value={form.name} onChange={(event) => updateField("name", event.target.value)} placeholder="Ex: João Silva" className="h-14 w-full rounded-2xl border border-border-soft bg-bg-muted/50 px-6 text-sm font-medium outline-none transition-all focus:bg-bg-surface focus:ring-4 focus:ring-primary-soft" />
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-xs font-black uppercase tracking-widest text-text-soft">E-mail</label>
                  <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} placeholder="seu@email.com" className="h-14 w-full rounded-2xl border border-border-soft bg-bg-muted/50 px-6 text-sm font-medium outline-none transition-all focus:bg-bg-surface focus:ring-4 focus:ring-primary-soft" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="ml-2 text-xs font-black uppercase tracking-widest text-text-soft">Telefone</label>
                  <input type="tel" value={form.phone} onChange={(event) => updateField("phone", event.target.value)} placeholder="(11) 99999-9999" className="h-14 w-full rounded-2xl border border-border-soft bg-bg-muted/50 px-6 text-sm font-medium outline-none transition-all focus:bg-bg-surface focus:ring-4 focus:ring-primary-soft" />
                </div>
                <div className="space-y-2">
                  <label className="ml-2 text-xs font-black uppercase tracking-widest text-text-soft">Produto</label>
                  <input type="text" value={form.product} onChange={(event) => updateField("product", event.target.value)} placeholder="Modelo desejado" className="h-14 w-full rounded-2xl border border-border-soft bg-bg-muted/50 px-6 text-sm font-medium outline-none transition-all focus:bg-bg-surface focus:ring-4 focus:ring-primary-soft" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="ml-2 text-xs font-black uppercase tracking-widest text-text-soft">Mensagem</label>
                <textarea rows={6} value={form.message} onChange={(event) => updateField("message", event.target.value)} placeholder="Conte o que você precisa ou qual modelo deseja consultar." className="w-full resize-none rounded-2xl border border-border-soft bg-bg-muted/50 p-6 text-sm font-medium outline-none transition-all focus:bg-bg-surface focus:ring-4 focus:ring-primary-soft" />
              </div>

              {feedback ? (
                <div className="flex items-center gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-medium text-emerald-700">
                  <CircleCheck size={18} />
                  {feedback}
                </div>
              ) : null}

              {error ? <div className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-medium text-rose-700">{error}</div> : null}

              <button disabled={isPending} className="flex h-16 w-full items-center justify-center gap-3 rounded-2xl bg-primary-600 px-12 text-lg font-black text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-700 hover:shadow-card active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 md:w-fit">
                <Send size={20} />
                {isPending ? "Enviando..." : "Enviar Solicitação"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
