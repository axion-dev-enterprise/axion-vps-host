import type { LucideIcon } from "lucide-react";
import {
  Activity,
  BellRing,
  CircuitBoard,
  Cloud,
  Cpu,
  Globe,
  HardDrive,
  Layers3,
  Shield,
  TerminalSquare,
  Wallet,
  Zap,
} from "lucide-react";

import type { VpsPlan } from "@/lib/api/vps";

export type ServerStatus = "online" | "warning" | "maintenance" | "offline";

export type ServerRecord = {
  id: string;
  name: string;
  region: string;
  os: string;
  plan: string;
  ip: string;
  status: ServerStatus;
  uptime: string;
  cpu: number;
  ram: number;
  disk: number;
  network: string;
  backups: string;
  firewall: string;
  bandwidth: string;
  locationLabel: string;
  note: string;
  tags: string[];
  alerts: string[];
};

export type BillingRecord = {
  id: string;
  description: string;
  amount: string;
  status: "paid" | "pending" | "processing";
  dueDate: string;
  method: string;
};

export const dashboardStats = [
  { label: "Servidores ativos", value: "12", delta: "+2 este mês", accent: "online" },
  { label: "Uso médio de CPU", value: "41%", delta: "-8% vs ontem", accent: "cyan" },
  { label: "RAM comprometida", value: "68 GB", delta: "72% da capacidade", accent: "purple" },
  { label: "Alertas críticos", value: "03", delta: "1 requer ação imediata", accent: "warning" },
] as const;

export const infraHighlights: Array<{ title: string; copy: string; icon: LucideIcon }> = [
  {
    title: "Provisionamento instantâneo",
    copy: "Crie ou escale VPS com templates prontos para produção, staging e workloads dedicados.",
    icon: Zap,
  },
  {
    title: "Observabilidade centralizada",
    copy: "CPU, RAM, disco, largura de banda e eventos operacionais em um único painel.",
    icon: Activity,
  },
  {
    title: "Segurança por padrão",
    copy: "Snapshots, firewall, isolamento por região e camadas extras para acesso administrativo.",
    icon: Shield,
  },
];

export const dashboardServices: Array<{ title: string; value: string; icon: LucideIcon; note: string }> = [
  { title: "Compute", value: "24 vCPU", icon: Cpu, note: "Capacidade disponível para scale-up imediato" },
  { title: "Storage", value: "1.8 TB", icon: HardDrive, note: "NVMe distribuído entre workloads de produção" },
  { title: "Network", value: "9.2 TB", icon: Globe, note: "Transferência estimada para o ciclo atual" },
  { title: "Shield", value: "99.98%", icon: Shield, note: "Uptime agregado nos últimos 30 dias" },
];

export const controlShortcuts: Array<{ title: string; copy: string; icon: LucideIcon }> = [
  { title: "Reinício inteligente", copy: "Aplique reboot sem perder o contexto operacional do host.", icon: CircuitBoard },
  { title: "Terminal web", copy: "Abra shell no navegador para troubleshooting rápido e seguro.", icon: TerminalSquare },
  { title: "Backups automáticos", copy: "Snapshots diários com retenção configurável por ambiente.", icon: Layers3 },
  { title: "Billing unificado", copy: "Cobrança, invoices e upgrades no mesmo fluxo do servidor.", icon: Wallet },
];

export const dashboardAlerts = [
  { level: "Crítico", title: "db-saopaulo-01 com pico de disco em 92%", copy: "Recomendado expandir volume ou rodar limpeza de imagens antigas." },
  { level: "Atenção", title: "edge-latam-02 com 3 reinícios nas últimas 24h", copy: "Verificar logs de aplicação e políticas de restart antes de escalar." },
  { level: "Info", title: "Backup incremental concluído", copy: "Todos os snapshots da janela 02:00-03:00 foram finalizados com sucesso." },
] as const;

export const demoServers: ServerRecord[] = [
  {
    id: "edge-br-01",
    name: "Edge BR #01",
    region: "São Paulo, BR",
    os: "Ubuntu 24.04 LTS",
    plan: "Performance 4",
    ip: "177.54.22.14",
    status: "online",
    uptime: "18 dias",
    cpu: 34,
    ram: 62,
    disk: 48,
    network: "1.2 Gbps",
    backups: "Ativos · 7 retenções",
    firewall: "Cloud + host",
    bandwidth: "2.4 TB / 5 TB",
    locationLabel: "LATAM",
    note: "Servidor estável para workloads web e automações de produção.",
    tags: ["Production", "Docker", "NVMe"],
    alerts: ["Nenhum incidente aberto"],
  },
  {
    id: "core-us-02",
    name: "Core US #02",
    region: "Miami, US",
    os: "Debian 12",
    plan: "Scale 8",
    ip: "185.77.18.203",
    status: "warning",
    uptime: "9 dias",
    cpu: 79,
    ram: 73,
    disk: 88,
    network: "980 Mbps",
    backups: "Ativos · 14 retenções",
    firewall: "WAF + ACL",
    bandwidth: "4.1 TB / 6 TB",
    locationLabel: "NA",
    note: "Uso alto de disco por logs e imagens antigas; recomenda-se limpeza ou upgrade.",
    tags: ["API", "Autoscale", "High IO"],
    alerts: ["Disco acima de 85%", "Fila de jobs mais lenta que o normal"],
  },
  {
    id: "backup-eu-03",
    name: "Backup EU #03",
    region: "Frankfurt, DE",
    os: "Ubuntu 22.04 LTS",
    plan: "Storage 6",
    ip: "91.204.51.40",
    status: "maintenance",
    uptime: "2 horas",
    cpu: 12,
    ram: 29,
    disk: 36,
    network: "640 Mbps",
    backups: "Janela em execução",
    firewall: "Host hardened",
    bandwidth: "1.7 TB / 4 TB",
    locationLabel: "EU",
    note: "Host em atualização de kernel com rollback preparado.",
    tags: ["Backups", "Snapshots", "Cold storage"],
    alerts: ["Janela de manutenção até 22:40"],
  },
  {
    id: "lab-dev-04",
    name: "Lab DEV #04",
    region: "Dallas, US",
    os: "Rocky Linux 9",
    plan: "Starter 2",
    ip: "149.102.12.78",
    status: "offline",
    uptime: "0 min",
    cpu: 0,
    ram: 0,
    disk: 24,
    network: "0 Mbps",
    backups: "Último snapshot há 12h",
    firewall: "Desativado no host",
    bandwidth: "124 GB / 2 TB",
    locationLabel: "LAB",
    note: "Instância parada para contenção de custos; pronta para start manual.",
    tags: ["Dev", "Temporary", "Cost saving"],
    alerts: ["Servidor desligado manualmente"],
  },
];

export const billingRecords: BillingRecord[] = [
  {
    id: "INV-2026-031",
    description: "Cluster production · março/2026",
    amount: "R$ 1.248,00",
    status: "paid",
    dueDate: "05 abr 2026",
    method: "PIX corporativo",
  },
  {
    id: "INV-2026-032",
    description: "Upgrade de storage NVMe",
    amount: "R$ 289,90",
    status: "processing",
    dueDate: "09 abr 2026",
    method: "Cartão corporativo",
  },
  {
    id: "INV-2026-033",
    description: "Snapshots extras + tráfego adicional",
    amount: "R$ 174,50",
    status: "pending",
    dueDate: "12 abr 2026",
    method: "Boleto",
  },
];

export const activityFeed = [
  "edge-br-01 reiniciado com sucesso após deploy do app gateway.",
  "Novo snapshot criado para core-us-02 antes da expansão do volume.",
  "Billing alertado sobre invoice INV-2026-033 pendente.",
  "Firewall rule atualizada para liberar acesso SSH apenas via IPs autorizados.",
] as const;

export const marketplaceBenefits: Array<{ title: string; copy: string; icon: LucideIcon }> = [
  { title: "Deploy rápido", copy: "Provisionamento de VPS com setup inicial otimizado para produção.", icon: Cloud },
  { title: "Proteção reforçada", copy: "Firewall, snapshots e isolamento por workload desde o primeiro boot.", icon: Shield },
  { title: "Monitoramento vivo", copy: "Métricas operacionais visíveis em tempo real para CPU, RAM e disco.", icon: BellRing },
];

export const fallbackPlans: VpsPlan[] = [
  {
    id: "starter-2",
    name: "Starter 2",
    priceMonthlyCents: 5990,
    priceYearlyCents: 5190,
    setupMinutes: "5-10 min",
    subtitle: "Entrada profissional para sites, APIs leves e ambientes de teste.",
    audience: "Ideal para MVPs, automações pequenas e painéis administrativos.",
    resources: {
      cpu: 2,
      ram: "4 GB",
      volume: "80 GB NVMe",
      publicNetwork: 1000,
      location: "São Paulo / Miami",
      image: "Ubuntu 24.04",
    },
    highlights: ["Snapshot diário", "1 IP público", "Firewall guiado", "Deploy assistido"],
  },
  {
    id: "performance-4",
    name: "Performance 4",
    priceMonthlyCents: 11990,
    priceYearlyCents: 10490,
    setupMinutes: "5-15 min",
    subtitle: "Plano equilibrado para produção estável, containers e stacks multi-serviço.",
    audience: "Melhor para SaaS, bots, painéis internos e aplicações com tráfego constante.",
    resources: {
      cpu: 4,
      ram: "8 GB",
      volume: "160 GB NVMe",
      publicNetwork: 2000,
      location: "São Paulo / Frankfurt",
      image: "Ubuntu 24.04",
    },
    highlights: ["Backups automáticos", "Console web", "Regiões globais", "Monitoramento ativo"],
  },
  {
    id: "scale-8",
    name: "Scale 8",
    priceMonthlyCents: 20990,
    priceYearlyCents: 18790,
    setupMinutes: "10-25 min",
    subtitle: "Alta disponibilidade para workloads mais intensos, bancos e APIs críticas.",
    audience: "Para operações de produção com alta concorrência, filas e alto throughput.",
    resources: {
      cpu: 8,
      ram: "16 GB",
      volume: "320 GB NVMe",
      publicNetwork: 3000,
      location: "Miami / Frankfurt / Singapura",
      image: "Ubuntu / Debian / Rocky",
    },
    highlights: ["Prioridade de suporte", "Backups expandidos", "Terminal avançado", "Escala vertical rápida"],
  },
];

export function getServerById(id: string) {
  return demoServers.find((server) => server.id === id) ?? demoServers[0];
}

export function getStatusTone(status: ServerStatus) {
  switch (status) {
    case "online":
      return "text-[#00ff88] border-[#00ff88]/20 bg-[#00ff88]/10";
    case "warning":
      return "text-amber-300 border-amber-400/20 bg-amber-400/10";
    case "maintenance":
      return "text-sky-300 border-sky-400/20 bg-sky-400/10";
    default:
      return "text-rose-300 border-rose-400/20 bg-rose-400/10";
  }
}
