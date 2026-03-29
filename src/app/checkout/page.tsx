import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { CheckoutSidebar } from "@/components/checkout/CheckoutSidebar";
import { Topbar } from "@/components/layout/Topbar";
import { getVpsPlans } from "@/lib/api/vps";

export const dynamic = "force-dynamic";

type CheckoutPageProps = {
  searchParams?: Promise<{ plan?: string }>;
};

export default async function CheckoutPage({ searchParams }: CheckoutPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const initialPlanId = params?.plan;
  const plans = await getVpsPlans()
    .then((response) => response.data)
    .catch(() => []);

  return (
    <main className="min-h-screen bg-bg-app font-sans">
      <Topbar />

      <section className="mx-auto max-w-[1440px] px-6 py-8 md:px-10 md:py-10">
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <CheckoutForm plans={plans} initialPlanId={initialPlanId} />
          <CheckoutSidebar plans={plans} />
        </div>
      </section>
    </main>
  );
}
