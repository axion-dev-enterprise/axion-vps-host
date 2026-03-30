import Link from "next/link";

const plans = [
  {
    name: "Starter",
    specs: ["1 vCPU", "2 GB RAM", "50 GB SSD"],
    monthly: "R$ 8,49/mês",
    yearly: "R$ 89,90/ano",
  },
  {
    name: "Pro",
    specs: ["2 vCPU", "4 GB RAM", "50 GB SSD"],
    monthly: "R$ 14,49/mês",
    yearly: "R$ 149,90/ano",
  },
  {
    name: "Modular",
    specs: ["2-4 vCPU", "4-8 GB RAM", "SSD Ilimitado"],
    monthly: "R$ 24,49/mês",
    yearly: "R$ 249,90/ano",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 sm:px-10">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">AXION VPS HOST</span>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">Hospedagem VPS de Alta Performance</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Servidores rápidos, painel profissional e suporte humano.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href="#planos"
            className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Ver Planos
          </Link>
          <Link
            href="/login"
            className="inline-flex min-w-[180px] items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
          >
            Login
          </Link>
        </div>
      </section>

      <section id="planos" className="mt-10">
        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <article
              key={plan.name}
              className="flex h-full flex-col rounded-[1.75rem] border border-white/10 bg-slate-950/60 p-6 shadow-xl shadow-black/20"
            >
              <h2 className="text-2xl font-semibold text-white">{plan.name}</h2>

              <div className="mt-6 space-y-3 text-slate-300">
                {plan.specs.map((spec) => (
                  <p key={spec} className="text-base leading-7">
                    {spec}
                  </p>
                ))}
              </div>

              <div className="mt-8 space-y-2 border-t border-white/10 pt-6">
                <p className="text-2xl font-semibold text-white">{plan.monthly}</p>
                <p className="text-lg font-medium text-cyan-300">{plan.yearly}</p>
              </div>

              <Link
                href="/checkout"
                className="mt-8 inline-flex items-center justify-center rounded-full bg-white px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
              >
                Contratar
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12 grid gap-6 sm:grid-cols-3">
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-2xl font-semibold text-white">5-15 min</p>
          <p className="mt-2 text-sm text-slate-400">Deploy rápido</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-2xl font-semibold text-white">Humano</p>
          <p className="mt-2 text-sm text-slate-400">Suporte real</p>
        </div>
        <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-6 text-center">
          <p className="text-2xl font-semibold text-white">Profissional</p>
          <p className="mt-2 text-sm text-slate-400">Painel completo</p>
        </div>
      </section>

      <footer className="mt-12 border-t border-white/10 px-2 pt-6 text-center text-sm text-slate-400">
        © 2026 AXION VPS HOST. Hospedagem simples, rápida e profissional.
      </footer>
    </main>
  );
}
