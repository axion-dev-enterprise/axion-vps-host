import type { Request, Response } from "express";

import type { VpsService } from "./vps.service";

function parseOrderBody(input: unknown) {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const customerName = typeof source.customerName === "string" ? source.customerName.trim() : "";
  const companyName = typeof source.companyName === "string" ? source.companyName.trim() : "";
  const email = typeof source.email === "string" ? source.email.trim() : "";
  const whatsapp = typeof source.whatsapp === "string" ? source.whatsapp.trim() : "";
  const planId = typeof source.planId === "string" ? source.planId.trim() : "";
  const billingCycle = source.billingCycle === "yearly" ? "yearly" : "monthly";
  const dnsMode = ["none", "a_record", "cname", "ns_manual"].includes(String(source.dnsMode)) ? String(source.dnsMode) : "none";
  const toolkitPreference = ["managed", "guided", "terminal_first"].includes(String(source.toolkitPreference))
    ? String(source.toolkitPreference)
    : "managed";

  if (!customerName || !companyName || !email || !whatsapp || !planId) {
    return null;
  }

  return {
    customerName,
    companyName,
    email,
    whatsapp,
    installerName: typeof source.installerName === "string" ? source.installerName.trim() : undefined,
    installerEmail: typeof source.installerEmail === "string" ? source.installerEmail.trim() : undefined,
    planId,
    billingCycle: billingCycle as "monthly" | "yearly",
    domain: typeof source.domain === "string" ? source.domain.trim() : undefined,
    zoneName: typeof source.zoneName === "string" ? source.zoneName.trim() : undefined,
    zoneId: typeof source.zoneId === "string" ? source.zoneId.trim() : undefined,
    dnsMode: dnsMode as "none" | "a_record" | "cname" | "ns_manual",
    recordType:
      source.recordType === "A" || source.recordType === "CNAME" || source.recordType === "NS"
        ? (source.recordType as "A" | "CNAME" | "NS")
        : undefined,
    recordName: typeof source.recordName === "string" ? source.recordName.trim() : undefined,
    notes: typeof source.notes === "string" ? source.notes.trim() : undefined,
    toolkitPreference: toolkitPreference as "managed" | "guided" | "terminal_first",
  };
}

export class VpsController {
  constructor(private readonly service: VpsService) {}

  plans = async (_req: Request, res: Response) => {
    res.status(200).json({ data: this.service.listPlans() });
  };

  createOrder = async (req: Request, res: Response) => {
    const parsed = parseOrderBody(req.body);
    if (!parsed) {
      return res.status(400).json({ message: "Parametros invalidos." });
    }

    const order = this.service.createOrder(parsed);
    return res.status(201).json({ data: order });
  };

  getOrder = async (req: Request, res: Response) => {
    const order = this.service.getOrder(String(req.params.id || ""));
    if (!order) {
      return res.status(404).json({ message: "Pedido nao encontrado." });
    }

    return res.status(200).json({ data: order });
  };

  adminDashboard = async (_req: Request, res: Response) => {
    return res.status(200).json({ data: this.service.getDashboard() });
  };

  adminOrders = async (_req: Request, res: Response) => {
    return res.status(200).json({ data: this.service.listOrders() });
  };

  adminProvision = async (req: Request, res: Response) => {
    try {
      const order = await this.service.provisionOrder(String(req.params.id || ""));
      return res.status(200).json({ data: order });
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : "Falha no provisionamento." });
    }
  };

  adminDns = async (req: Request, res: Response) => {
    const source = req.body && typeof req.body === "object" ? (req.body as Record<string, unknown>) : {};

    try {
      const order = await this.service.configureDns(String(req.params.id || ""), {
        zoneId: typeof source.zoneId === "string" ? source.zoneId.trim() : undefined,
        zoneName: typeof source.zoneName === "string" ? source.zoneName.trim() : undefined,
        recordType:
          source.recordType === "A" || source.recordType === "CNAME" || source.recordType === "NS"
            ? (source.recordType as "A" | "CNAME" | "NS")
            : undefined,
        recordName: typeof source.recordName === "string" ? source.recordName.trim() : undefined,
      });
      return res.status(200).json({ data: order });
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : "Falha ao configurar DNS." });
    }
  };

  adminSendInstallerAccess = async (req: Request, res: Response) => {
    try {
      const order = await this.service.sendInstallerAccess(String(req.params.id || ""));
      return res.status(200).json({ data: order });
    } catch (error) {
      return res.status(400).json({ message: error instanceof Error ? error.message : "Falha ao enviar e-mail." });
    }
  };
}
