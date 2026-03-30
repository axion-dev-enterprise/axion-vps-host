import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSidebar } from "@/components/checkout/CheckoutSidebar";
import { getVpsPlans } from "@/lib/api/vps";
import { fallbackPlans } from "@/lib/vps-content";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  searchParams?: Promise<{ plan?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const initialPlanId = params?.plan;
  const plans = await getVpsPlans()
    .then((response) => response.data)
    .catch(() => fallbackPlans);

  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Checkout</p>
        <h1 className="mt-2 text-4xl font-semibold text-text-strong">Contratação de VPS</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-soft">
          Fluxo adaptado para compra de hospedagem: plano, billing cycle, dados do cliente, domínio e preferência operacional.
        </p>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <CheckoutForm plans={plans} initialPlanId={initialPlanId} />
        <CheckoutSidebar plans={plans} />
      </section>
    </div>
  );
}
