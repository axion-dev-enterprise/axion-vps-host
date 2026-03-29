import type { Request, Response } from "express";

import type { AdminService } from "./admin.service";

type AdminRequest = Request & {
  adminSession?: { email: string; expiresAt: string } | null;
  adminToken?: string | null;
};

function parsePhoneBody(input: unknown) {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const brand = typeof source.brand === "string" ? source.brand.trim() : "";
  const model = typeof source.model === "string" ? source.model.trim() : "";
  const storageGb = Number(source.storageGb);
  const imageUrl = typeof source.imageUrl === "string" ? source.imageUrl.trim() : "";
  const shortDescription = typeof source.shortDescription === "string" ? source.shortDescription.trim() : "";

  if (!brand || !model || !Number.isInteger(storageGb) || storageGb <= 0) {
    return null;
  }

  return {
    id: typeof source.id === "string" ? source.id.trim() : undefined,
    brand,
    model,
    storageGb,
    priceCents: 0,
    quoteOnly: true,
    imageUrl: imageUrl || undefined,
    shortDescription: shortDescription || undefined,
  };
}

function parseSettingsBody(input: unknown) {
  const source = input && typeof input === "object" ? (input as Record<string, unknown>) : {};
  const fields = [
    "businessName",
    "supportEmail",
    "whatsappNumber",
    "whatsappUrl",
    "instagramUrl",
    "facebookUrl",
    "locationLabel",
    "heroBadge",
    "heroResponseTime",
  ] as const;

  const parsed = Object.fromEntries(
    fields.map((field) => [field, typeof source[field] === "string" ? source[field].trim() : ""]),
  ) as Record<(typeof fields)[number], string>;

  return fields.every((field) => parsed[field]) ? parsed : null;
}

export class AdminController {
  constructor(private readonly service: AdminService) {}

  session = async (req: AdminRequest, res: Response) => {
    return res.status(200).json({ data: req.adminSession });
  };

  login = async (req: Request, res: Response) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const password = typeof req.body?.password === "string" ? req.body.password : "";
    const session = this.service.login(email, password);

    if (!session) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    res.setHeader(
      "Set-Cookie",
      `pontotecc_admin_session=${session.token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${12 * 60 * 60}`,
    );

    return res.status(200).json({ data: { email: session.email, expiresAt: session.expiresAt } });
  };

  logout = async (req: AdminRequest, res: Response) => {
    const token = req.adminToken;
    if (token) {
      this.service.logout(token);
    }

    res.setHeader("Set-Cookie", "pontotecc_admin_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0");
    return res.status(200).json({ ok: true });
  };

  overview = async (_req: Request, res: Response) => {
    return res.status(200).json({ data: this.service.getOverview() });
  };

  listProducts = async (_req: Request, res: Response) => {
    return res.status(200).json({ data: this.service.listProducts() });
  };

  createProduct = async (req: Request, res: Response) => {
    const parsed = parsePhoneBody(req.body);
    if (!parsed) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    const id = this.service.createProduct(parsed);
    return res.status(201).json({ ok: true, id });
  };

  updateProduct = async (req: Request, res: Response) => {
    const id = String(req.params.id || "").trim();
    const parsed = parsePhoneBody(req.body);
    if (!id || !parsed) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    this.service.updateProduct(id, parsed);
    return res.status(200).json({ ok: true });
  };

  deleteProduct = async (req: Request, res: Response) => {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    this.service.deleteProduct(id);
    return res.status(200).json({ ok: true });
  };

  syncProducts = async (_req: Request, res: Response) => {
    const result = await this.service.syncProducts();
    return res.status(200).json(result);
  };

  listQuoteRequests = async (_req: Request, res: Response) => {
    return res.status(200).json({ data: this.service.listQuoteRequests() });
  };

  getSettings = async (_req: Request, res: Response) => {
    return res.status(200).json({ data: this.service.getSettings() });
  };

  updateSettings = async (req: Request, res: Response) => {
    const parsed = parseSettingsBody(req.body);
    if (!parsed) {
      return res.status(400).json({ message: "Parâmetros inválidos." });
    }

    this.service.updateSettings(parsed);
    return res.status(200).json({ ok: true });
  };
}
