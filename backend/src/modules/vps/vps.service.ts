import nodemailer from "nodemailer";

import type { RuntimeEnv } from "../../config/env";
import type { VpsDashboard, VpsOrderInput, VpsPlan } from "./vps.models";
import { VpsRepository } from "./vps.repository";

const VSP_PLANS: VpsPlan[] = [
  {
    id: "launch",
    name: "Launch",
    priceMonthlyCents: 18900,
    priceYearlyCents: 17900,
    setupMinutes: "5-10 min",
    subtitle: "Para landing pages, automacoes leves e stacks simples",
    audience: "Pequenas operacoes que precisam sair do zero com suporte guiado.",
    resources: {
      cpu: 1,
      ram: "2G",
      volume: "25G",
      publicNetwork: 50,
      location: "br",
      image: "Ubuntu-24.04.2-X64",
    },
    highlights: ["Provisionamento rapido", "DNS guiado", "Credenciais prontas para instalador"],
  },
  {
    id: "growth",
    name: "Growth",
    priceMonthlyCents: 34700,
    priceYearlyCents: 32900,
    setupMinutes: "10-15 min",
    subtitle: "Para sites, APIs e operacoes comerciais com trafego moderado",
    audience: "Times que precisam de folga para rodar app, painel e integrações no mesmo servidor.",
    resources: {
      cpu: 2,
      ram: "4G",
      volume: "50G",
      publicNetwork: 50,
      location: "br",
      image: "Ubuntu-24.04.2-X64",
    },
    highlights: ["Mais margem para app + banco", "Cloudflare com A ou CNAME", "Toolkit human-friendly"],
  },
  {
    id: "scale",
    name: "Scale",
    priceMonthlyCents: 59700,
    priceYearlyCents: 55900,
    setupMinutes: "15-25 min",
    subtitle: "Para SaaS, gateways e stacks com mais runtime e operacao recorrente",
    audience: "Operacoes que precisam de VPS pronta para crescer com menos gargalo.",
    resources: {
      cpu: 4,
      ram: "8G",
      volume: "120G",
      publicNetwork: 100,
      location: "br",
      image: "Ubuntu-24.04.2-X64",
    },
    highlights: ["Provisionamento com sobra de recurso", "Entrega pronta para dev instalador", "Painel de handoff enterprise"],
  },
];

type WorkerProvisionResponse = {
  serverId?: string;
  name?: string;
  publicIp?: string;
  location?: string;
  image?: string;
  cpu?: number;
  ram?: string;
  volume?: string;
  raw?: {
    login?: string;
    password?: string;
  };
};

export class VpsService {
  constructor(
    private readonly repository: VpsRepository,
    private readonly runtimeEnv: RuntimeEnv,
  ) {}

  listPlans() {
    return VSP_PLANS;
  }

  getDashboard(): VpsDashboard {
    return this.repository.getDashboard();
  }

  listOrders() {
    return this.repository.listOrders().map((order) => ({
      ...order,
      events: this.repository.listEvents(order.id),
    }));
  }

  getOrder(id: string) {
    const order = this.repository.getOrder(id);
    if (!order) return null;
    return {
      ...order,
      events: this.repository.listEvents(order.id),
    };
  }

  createOrder(input: VpsOrderInput) {
    const order = this.repository.createOrder(input);
    this.repository.createEvent(order.id, "order.created", `Pedido criado para o plano ${order.planId}.`);

    if (this.runtimeEnv.SERVERSPACE_WORKER_BASE_URL && this.runtimeEnv.SERVERSPACE_WORKER_TOKEN) {
      this.queueProvisionOrder(order.id);
    }

    return {
      ...order,
      events: this.repository.listEvents(order.id),
    };
  }

  private queueProvisionOrder(id: string) {
    queueMicrotask(() => {
      void this.provisionOrder(id).catch((error) => {
        const message = error instanceof Error ? error.message : "Falha inesperada no worker de provisionamento.";
        console.error(`[axion-vps] provisioning background failure for ${id}: ${message}`);
      });
    });
  }

  async provisionOrder(id: string) {
    const order = this.repository.getOrder(id);
    if (!order) {
      throw new Error("Pedido nao encontrado.");
    }

    const plan = VSP_PLANS.find((item) => item.id === order.planId);
    if (!plan) {
      throw new Error("Plano de provisionamento nao encontrado.");
    }

    if (!this.runtimeEnv.SERVERSPACE_WORKER_BASE_URL || !this.runtimeEnv.SERVERSPACE_WORKER_TOKEN) {
      throw new Error("Worker do ServerSpace nao configurado.");
    }

    this.repository.updateOrder(id, { status: "provisioning", failureReason: undefined });
    this.repository.createEvent(id, "provisioning.started", "Provisionamento da VPS iniciado no worker.");

    try {
      const response = await fetch(`${this.runtimeEnv.SERVERSPACE_WORKER_BASE_URL.replace(/\/$/, "")}/provision-server`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          authorization: `Bearer ${this.runtimeEnv.SERVERSPACE_WORKER_TOKEN}`,
        },
        body: JSON.stringify({
          workspaceSlug: `axion-vps-${order.id.slice(0, 8)}`,
          location: plan.resources.location,
          image: plan.resources.image,
          cpu: plan.resources.cpu,
          ram: plan.resources.ram,
          volume: plan.resources.volume,
          publicNetwork: plan.resources.publicNetwork,
          sshKeyId: 35040,
        }),
      });

      const payload = (await response.json().catch(() => ({}))) as WorkerProvisionResponse & {
        ok?: boolean;
        error?: string;
      };

      if (!response.ok || !payload.serverId || !payload.publicIp) {
        throw new Error(payload.error || "Falha ao provisionar VPS.");
      }

      const rootUser = payload.raw?.login || "root";
      const rootPassword = payload.raw?.password || "";
      const sshCommand = `ssh ${rootUser}@${payload.publicIp}`;
      const setupChecklist = [
        "Acesse a VPS com o comando SSH informado.",
        "Atualize o servidor com apt update && apt upgrade -y.",
        "Instale Docker, Node ou o runtime exigido pela stack.",
        "Finalize o apontamento de dominio ou DNS no Cloudflare.",
        "Envie as credenciais ao dev instalador pelo painel.",
      ].join("\n");

      this.repository.updateOrder(id, {
        status: order.dnsMode === "none" || order.dnsMode === "ns_manual" ? "ready" : "dns_pending",
        serverId: payload.serverId,
        serverIp: payload.publicIp,
        serverRegion: payload.location || plan.resources.location,
        rootUser,
        rootPassword,
        sshCommand,
        setupChecklist,
      });
      this.repository.createEvent(id, "provisioning.ready", `VPS criada com IP ${payload.publicIp}.`);

      if (order.dnsMode === "a_record" || order.dnsMode === "cname") {
        await this.configureDns(id, {
          zoneId: order.zoneId,
          zoneName: order.zoneName,
          recordType: order.dnsMode === "a_record" ? "A" : "CNAME",
          recordName: order.recordName || order.domain || "",
        });
      }

      return this.getOrder(id);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Falha ao provisionar VPS.";
      this.repository.updateOrder(id, { status: "failed", failureReason: message });
      this.repository.createEvent(id, "provisioning.failed", message);
      throw new Error(message);
    }
  }

  async configureDns(
    id: string,
    input?: {
      zoneId?: string;
      zoneName?: string;
      recordType?: "A" | "CNAME" | "NS";
      recordName?: string;
    },
  ) {
    const order = this.repository.getOrder(id);
    if (!order) {
      throw new Error("Pedido nao encontrado.");
    }

    if (!order.serverIp) {
      throw new Error("A VPS ainda nao foi provisionada.");
    }

    const nextRecordType = input?.recordType || order.recordType;
    if (!nextRecordType) {
      throw new Error("Tipo de registro DNS nao informado.");
    }

    if (nextRecordType === "NS") {
      this.repository.updateOrder(id, {
        status: "ready",
        recordType: "NS",
        recordContent: "Atualize os nameservers no registrador. Cloudflare nao gerencia essa etapa por API de zona.",
      });
      this.repository.createEvent(id, "dns.manual", "Pedido marcado com orientacao manual de nameserver.");
      return this.getOrder(id);
    }

    if (!this.runtimeEnv.CLOUDFLARE_API_TOKEN) {
      throw new Error("Cloudflare API token nao configurado.");
    }

    const zoneId = input?.zoneId || order.zoneId || (await this.resolveZoneId(input?.zoneName || order.zoneName || ""));
    const recordName = input?.recordName || order.recordName || order.domain || "";
    const recordContent = nextRecordType === "A" ? order.serverIp : order.domain || order.serverIp;

    const existingResponse = await fetch(
      `${this.runtimeEnv.CLOUDFLARE_API_BASE_URL}/zones/${zoneId}/dns_records?type=${encodeURIComponent(nextRecordType)}&name=${encodeURIComponent(recordName)}`,
      {
        headers: {
          authorization: `Bearer ${this.runtimeEnv.CLOUDFLARE_API_TOKEN}`,
          "content-type": "application/json",
        },
      },
    );
    const existingPayload = (await existingResponse.json().catch(() => ({}))) as {
      success?: boolean;
      result?: Array<{ id: string }>;
      errors?: Array<{ message?: string }>;
    };
    if (!existingResponse.ok || existingPayload.success === false) {
      throw new Error(existingPayload.errors?.[0]?.message || "Falha ao consultar DNS no Cloudflare.");
    }

    const recordBody = JSON.stringify({
      type: nextRecordType,
      name: recordName,
      content: recordContent,
      proxied: nextRecordType === "A",
      ttl: 120,
    });

    const existingId = existingPayload.result?.[0]?.id;
    const endpoint = existingId
      ? `${this.runtimeEnv.CLOUDFLARE_API_BASE_URL}/zones/${zoneId}/dns_records/${existingId}`
      : `${this.runtimeEnv.CLOUDFLARE_API_BASE_URL}/zones/${zoneId}/dns_records`;
    const method = existingId ? "PUT" : "POST";

    const saveResponse = await fetch(endpoint, {
      method,
      headers: {
        authorization: `Bearer ${this.runtimeEnv.CLOUDFLARE_API_TOKEN}`,
        "content-type": "application/json",
      },
      body: recordBody,
    });
    const savePayload = (await saveResponse.json().catch(() => ({}))) as {
      success?: boolean;
      errors?: Array<{ message?: string }>;
    };

    if (!saveResponse.ok || savePayload.success === false) {
      throw new Error(savePayload.errors?.[0]?.message || "Falha ao salvar DNS no Cloudflare.");
    }

    this.repository.updateOrder(id, {
      status: "ready",
      zoneId,
      zoneName: input?.zoneName || order.zoneName,
      recordType: nextRecordType,
      recordName,
      recordContent,
    });
    this.repository.createEvent(id, "dns.ready", `Registro ${nextRecordType} criado/apontado para ${recordContent}.`);
    return this.getOrder(id);
  }

  async sendInstallerAccess(id: string) {
    const order = this.repository.getOrder(id);
    if (!order) {
      throw new Error("Pedido nao encontrado.");
    }

    if (!order.installerEmail) {
      throw new Error("E-mail do dev instalador nao foi informado.");
    }

    if (!order.serverIp || !order.rootPassword || !order.rootUser) {
      throw new Error("As credenciais ainda nao estao prontas para envio.");
    }

    if (!this.runtimeEnv.SMTP_HOST || !this.runtimeEnv.SMTP_PORT || !this.runtimeEnv.SMTP_FROM) {
      const transporter = nodemailer.createTransport({
        sendmail: true,
        newline: "unix",
        path: process.env.SENDMAIL_PATH || "/usr/sbin/sendmail",
      });

      await transporter.sendMail({
        from: this.runtimeEnv.SMTP_FROM || "infra@axionenterprise.cloud",
        to: order.installerEmail,
        subject: `[AXION VPS] Credenciais da VPS ${order.companyName}`,
        text: [
          `Pedido: ${order.id}`,
          `Cliente: ${order.customerName} / ${order.companyName}`,
          `IP: ${order.serverIp}`,
          `Usuario: ${order.rootUser}`,
          `Senha root: ${order.rootPassword}`,
          `SSH: ${order.sshCommand || `ssh ${order.rootUser}@${order.serverIp}`}`,
          `Dominio: ${order.domain || "nao informado"}`,
          "",
          "Checklist sugerido:",
          order.setupChecklist || "Acesse a VPS e inicie a stack do cliente.",
        ].join("\n"),
      });

      this.repository.updateOrder(id, { status: "credentials_sent" });
      this.repository.createEvent(id, "credentials.sent", `Credenciais enviadas para ${order.installerEmail} via sendmail local.`);
      return this.getOrder(id);
    }

    const transporter = nodemailer.createTransport({
      host: this.runtimeEnv.SMTP_HOST,
      port: this.runtimeEnv.SMTP_PORT,
      secure: this.runtimeEnv.SMTP_SECURE,
      auth:
        this.runtimeEnv.SMTP_USER && this.runtimeEnv.SMTP_PASSWORD
          ? {
              user: this.runtimeEnv.SMTP_USER,
              pass: this.runtimeEnv.SMTP_PASSWORD,
            }
          : undefined,
    });

    await transporter.sendMail({
      from: this.runtimeEnv.SMTP_FROM,
      to: order.installerEmail,
      subject: `[AXION VPS] Credenciais da VPS ${order.companyName}`,
      text: [
        `Pedido: ${order.id}`,
        `Cliente: ${order.customerName} / ${order.companyName}`,
        `IP: ${order.serverIp}`,
        `Usuario: ${order.rootUser}`,
        `Senha root: ${order.rootPassword}`,
        `SSH: ${order.sshCommand || `ssh ${order.rootUser}@${order.serverIp}`}`,
        `Dominio: ${order.domain || "nao informado"}`,
        "",
        "Checklist sugerido:",
        order.setupChecklist || "Acesse a VPS e inicie a stack do cliente.",
      ].join("\n"),
    });

    this.repository.updateOrder(id, { status: "credentials_sent" });
    this.repository.createEvent(id, "credentials.sent", `Credenciais enviadas para ${order.installerEmail}.`);
    return this.getOrder(id);
  }

  private async resolveZoneId(zoneName: string) {
    if (!zoneName) {
      throw new Error("Zone name do Cloudflare nao informado.");
    }

    const response = await fetch(
      `${this.runtimeEnv.CLOUDFLARE_API_BASE_URL}/zones?name=${encodeURIComponent(zoneName)}&account.id=${encodeURIComponent(this.runtimeEnv.CLOUDFLARE_ACCOUNT_ID || "")}`,
      {
        headers: {
          authorization: `Bearer ${this.runtimeEnv.CLOUDFLARE_API_TOKEN}`,
          "content-type": "application/json",
        },
      },
    );
    const payload = (await response.json().catch(() => ({}))) as {
      success?: boolean;
      result?: Array<{ id: string }>;
      errors?: Array<{ message?: string }>;
    };

    if (!response.ok || payload.success === false) {
      throw new Error(payload.errors?.[0]?.message || "Falha ao localizar zona no Cloudflare.");
    }

    const zoneId = payload.result?.[0]?.id;
    if (!zoneId) {
      throw new Error("Zona do Cloudflare nao encontrada.");
    }

    return zoneId;
  }
}
