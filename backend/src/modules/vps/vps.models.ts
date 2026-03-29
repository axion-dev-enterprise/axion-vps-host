export type VpsPlan = {
  id: string;
  name: string;
  priceMonthlyCents: number;
  priceYearlyCents: number;
  setupMinutes: string;
  subtitle: string;
  resources: {
    cpu: number;
    ram: string;
    volume: string;
    publicNetwork: number;
    location: string;
    image: string;
  };
  highlights: string[];
  audience: string;
};

export type VpsOrderInput = {
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

export type VpsOrderRecord = VpsOrderInput & {
  id: string;
  status:
    | "pending_review"
    | "queued"
    | "provisioning"
    | "dns_pending"
    | "ready"
    | "credentials_sent"
    | "failed";
  recordContent?: string;
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
};

export type VpsOrderEvent = {
  id: string;
  orderId: string;
  type: string;
  message: string;
  payload?: string;
  createdAt: string;
};

export type VpsDashboard = {
  totalOrders: number;
  activeProvisioning: number;
  readyServers: number;
  failedOrders: number;
  lastOrderAt?: string;
};
