import "server-only";

import { promises as fs } from "node:fs";
import path from "node:path";

import { getAxionPayCheckoutUrl } from "@/lib/axionpay";
import type { VpsPlan } from "@/lib/api/vps";

export type MarketplacePlanRecord = {
  id: string;
  name: string;
  cpu: number;
  ram: number;
  disk: number;
  price_monthly: number;
  serverspace_template: string;
  serverspace_plan: string;
};

export type ClientServerRecord = {
  client_id: string;
  plan_id: string;
  serverspace_server_id: string;
  status: string;
  created_at: string;
  expires_at: string;
  server_name?: string;
  mock?: boolean;
  provision_request?: Record<string, unknown>;
};

const plansPath = path.join(process.cwd(), "data", "plans.json");
const clientServersPath = path.join(process.cwd(), "data", "client-servers.json");

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, data: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function getMarketplacePlansRaw() {
  return readJsonFile<MarketplacePlanRecord[]>(plansPath, []);
}

export async function getMarketplacePlansForUi(): Promise<VpsPlan[]> {
  const plans = await getMarketplacePlansRaw();

  return plans.map((plan, index) => ({
    id: plan.id,
    name: plan.name,
    priceMonthlyCents: Math.round(plan.price_monthly * 100),
    priceYearlyCents: Math.round(plan.price_monthly * 12 * 0.9 * 100),
    setupMinutes: index === 0 ? "5-10 min" : "5-15 min",
    subtitle: `${plan.cpu} vCPU, ${plan.ram} GB RAM e ${plan.disk} GB de disco com provisionamento pronto para producao.`,
    audience:
      index === 0
        ? "Ideal para landing pages, stacks leves, bots e workloads de entrada."
        : "Melhor para SaaS, automacoes, APIs e workloads com folga operacional.",
    resources: {
      cpu: plan.cpu,
      ram: `${plan.ram} GB`,
      volume: `${plan.disk} GB NVMe`,
      publicNetwork: 1000,
      location: "ServerSpace / projeto AXION",
      image: plan.serverspace_template,
    },
    highlights: [
      `Template ${plan.serverspace_template}`,
      `Plano ${plan.serverspace_plan}`,
      "Checkout AXION-PAY",
      "Provisionamento automatizavel",
    ],
    checkoutUrl: getAxionPayCheckoutUrl(plan.id),
  }));
}

export async function getPlanById(planId: string) {
  const plans = await getMarketplacePlansRaw();
  return plans.find((plan) => plan.id === planId) ?? null;
}

export async function getClientServers() {
  return readJsonFile<ClientServerRecord[]>(clientServersPath, []);
}

export async function appendClientServer(record: ClientServerRecord) {
  const current = await getClientServers();
  current.push(record);
  await writeJsonFile(clientServersPath, current);
  return record;
}
