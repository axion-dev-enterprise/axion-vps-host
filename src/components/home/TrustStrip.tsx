const items = [
  "Catálogo conectado ao backend",
  "Imagens reais do marketplace",
  "Formulário persistido no banco",
  "Cloudflare Tunnel ativo",
  "Atendimento por orçamento",
  "UI otimizada para mobile",
];

export function TrustStrip() {
  return (
    <section className="mx-auto mt-10 max-w-[1440px] px-6 md:px-10">
      <div className="overflow-hidden rounded-[1.6rem] border border-white/80 bg-white/65 shadow-soft backdrop-blur-md">
        <div className="flex min-w-max animate-marquee gap-3 px-4 py-4 [animation-duration:26s]">
          {[...items, ...items].map((item, index) => (
            <div
              key={`${item}-${index}`}
              className="flex items-center gap-3 rounded-full border border-slate-200/80 bg-slate-50/90 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              <span className="h-2 w-2 rounded-full bg-primary-500" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
