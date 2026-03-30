import { fetchApiJson } from "@/lib/api/http";

export type VpsPlan = {
  id: string;
  name: string;
  priceMonthlyCents: number;
  priceYearlyCents: number;
  setupMinutes: string;
  subtitle: string;
  audience: string;
  checkoutUrl?: string;
  resources: {
    cpu: number;
    ram: string;
    volume: string;
    publicNetwork: number;
    location: string;
    image: string;
  };
  highlights: string[];
};

export type VpsOrder = {
  id: string;
  customerName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  installerName?: string;
  installerEmail?: string;
  planId: string;
  billingCycle: "monthly" | "yearly";
  status: string;
  domain?: string;
  zoneName?: string;
  zoneId?: string;
  dnsMode: "none" | "a_record" | "cname" | "ns_manual";
  recordType?: "A" | "CNAME" | "NS";
  recordName?: string;
  recordContent?: string;
  notes?: string;
  toolkitPreference: "managed" | "guided" | "terminal_first";
  serverId?: string;
  serverIp?: string;
  serverRegion?: string;
  rootUser?: string;
  rootPassword?: string;
  sshCommand?: string;
  setupChecklist?: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
  events?: Array<{
    id: string;
    orderId: string;
    type: string;
    message: string;
    payload?: string;
    createdAt: string;
  }>;
};

export type VpsDashboard = {
  totalOrders: number;
  activeProvisioning: number;
  readyServers: number;
  failedOrders: number;
  lastOrderAt?: string;
};

export type CreateVpsOrderInput = {
  customerName: string;
  companyName: string;
  email: string;
  whatsapp: string;
  installerName?: string;
  installerEmail?: string;
  planId: string;
  billingCycle: "monthly" | "yearly";
  domain?: string;
  zoneName?: string;
  zoneId?: string;
  dnsMode: "none" | "a_record" | "cname" | "ns_manual";
  recordType?: "A" | "CNAME" | "NS";
  recordName?: string;
  notes?: string;
  toolkitPreference: "managed" | "guided" | "terminal_first";
};

export async function getVpsPlans() {
  return fetchApiJson<{ data: VpsPlan[] }>({ path: "/api/plans" });
}

export async function createVpsOrder(input: CreateVpsOrderInput) {
  return fetchApiJson<{ data: VpsOrder }>({
    path: "/api/v1/vps/orders",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  });
}

export async function getVpsOrder(id: string) {
  return fetchApiJson<{ data: VpsOrder }>({ path: `/api/v1/vps/orders/${id}` });
}

export async function getAdminVpsDashboard() {
  return fetchApiJson<{ data: VpsDashboard }>({
    path: "/api/v1/admin/vps/dashboard",
    init: { credentials: "include" },
  });
}

export async function getAdminVpsOrders() {
  return fetchApiJson<{ data: VpsOrder[] }>({
    path: "/api/v1/admin/vps/orders",
    init: { credentials: "include" },
  });
}

export async function adminProvisionVpsOrder(id: string) {
  return fetchApiJson<{ data: VpsOrder }>({
    path: `/api/v1/admin/vps/orders/${id}/provision`,
    init: {
      method: "POST",
      credentials: "include",
    },
  });
}

export async function adminConfigureVpsDns(id: string, input: { zoneId?: string; zoneName?: string; recordType?: "A" | "CNAME" | "NS"; recordName?: string }) {
  return fetchApiJson<{ data: VpsOrder }>({
    path: `/api/v1/admin/vps/orders/${id}/dns`,
    init: {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    },
  });
}

export async function adminSendInstallerAccess(id: string) {
  return fetchApiJson<{ data: VpsOrder }>({
    path: `/api/v1/admin/vps/orders/${id}/send-installer-access`,
    init: {
      method: "POST",
      credentials: "include",
    },
  });
}
