import { CreditCard, ReceiptText, Wallet } from "lucide-react";

import { billingRecords } from "@/lib/vps-content";

const statusClasses = {
  paid: "text-[#00ff88] border-[#00ff88]/20 bg-[#00ff88]/10",
  pending: "text-amber-300 border-amber-400/20 bg-amber-400/10",
  processing: "text-cyan-300 border-cyan-400/20 bg-cyan-400/10",
} as const;

export default function BillingPage() {
  return (
    <div className="space-y-8">
      <section className="glass-card rounded-[2rem] border border-white/10 p-6 md:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-cyan-300">Billing</p>
        <h1 className="mt-2 text-4xl font-semibold text-text-strong">Faturas e pagamentos</h1>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-text-soft">
          Histórico financeiro com invoices, métodos de pagamento, upgrades e status de cobrança por ambiente.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        <Summary icon={Wallet} label="MRR infraestrutura" value="R$ 8.490,00" note="Receita recorrente mensal prevista" />
        <Summary icon={CreditCard} label="Pagamentos em processamento" value="02" note="Aguardando confirmação da adquirente" />
        <Summary icon={ReceiptText} label="Faturas pendentes" value="01" note="Vencimento mais próximo em 12 abr 2026" />
      </section>

      <section className="glass-card overflow-hidden rounded-[2rem] border border-white/10">
        <div className="border-b border-white/10 px-6 py-5">
          <h2 className="text-2xl font-semibold text-white">Histórico de invoices</h2>
        </div>
        <div className="divide-y divide-white/10">
          {billingRecords.map((record) => (
            <div key={record.id} className="grid gap-4 px-6 py-5 md:grid-cols-[1.2fr_0.8fr_0.7fr_0.7fr] md:items-center">
              <div>
                <p className="text-lg font-semibold text-white">{record.description}</p>
                <p className="mt-1 text-sm text-text-soft">{record.id}</p>
              </div>
              <div>
                <p className="text-sm text-text-soft">Vencimento</p>
                <p className="mt-1 font-medium text-white">{record.dueDate}</p>
              </div>
              <div>
                <p className="text-sm text-text-soft">Método</p>
                <p className="mt-1 font-medium text-white">{record.method}</p>
              </div>
              <div className="flex items-center justify-between gap-3 md:justify-end">
                <p className="text-lg font-semibold text-white">{record.amount}</p>
                <span className={`rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] ${statusClasses[record.status]}`}>
                  {record.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Summary({ icon: Icon, label, value, note }: { icon: typeof Wallet; label: string; value: string; note: string }) {
  return (
    <article className="glass-card rounded-[1.8rem] border border-white/10 p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/10 text-cyan-300">
        <Icon size={18} />
      </div>
      <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-text-soft">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
      <p className="mt-2 text-sm text-text-soft">{note}</p>
    </article>
  );
}
