import Link from "next/link";

const plans = [
  {
    name: "Starter 2",
    specs: ["2 vCPU", "4 GB RAM", "80 GB NVMe"],
    monthly: "R$ 59,90/mês",
    yearly: "R$ 51,90/mês",
  },
  {
    name: "Performance 4",
    specs: ["4 vCPU", "8 GB RAM", "160 GB NVMe"],
    monthly: "R$ 119,90/mês",
    yearly: "R$ 104,90/mês",
  },
  {
    name: "Scale 8",
    specs: ["8 vCPU", "16 GB RAM", "320 GB NVMe"],
    monthly: "R$ 209,90/mês",
    yearly: "R$ 187,90/mês",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-120px)] w-full max-w-7xl flex-col px-4 py-10 sm:px-6 lg:px-8">
      <section className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center shadow-2xl shadow-black/20 sm:px-10">
        <span className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-300">AXION VPS HOST</span>
        <h1 className="mt-4 text-4xl font-semibold text-white sm:text-5xl">VPS pronta para rodar seu projeto sem complicação</h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
          Escolha um plano direto, com performance, estabilidade e recursos sob medida para colocar sua operação no ar.
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
                <p className="text-sm text-slate-400">(plano anual)</p>
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

      <footer className="mt-12 border-t border-white/10 px-2 pt-6 text-center text-sm text-slate-400">
        © 2026 AXION VPS HOST. Estrutura simples, clara e pronta para conversão.
      </footer>
    </main>
  );
}
