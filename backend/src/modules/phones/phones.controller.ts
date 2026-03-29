import { listPhonesQuerySchema } from "@pontotecc/contract";
import type { Request, Response } from "express";

import type { PhonesService } from "./phones.service";

function toQuoteOnlyPhone<T extends { priceCents?: number }>(phone: T): Omit<T, "priceCents"> {
  const sanitized = { ...phone };
  delete sanitized.priceCents;
  return sanitized;
}

export class PhonesController {
  constructor(private readonly service: PhonesService) {}

  list = async (req: Request, res: Response) => {
    const parsed = listPhonesQuerySchema.safeParse(req.query);
    if (!parsed.success) {
      return res.status(400).json({ message: "Parametros invalidos.", issues: parsed.error.issues });
    }

    const result = await this.service.list(parsed.data);
    return res.status(200).json({
      ...result,
      data: result.data.map((phone) => toQuoteOnlyPhone(phone)),
    });
  };

  getById = async (req: Request, res: Response) => {
    const id = String(req.params.id || "").trim();
    if (!id) {
      return res.status(400).json({ message: "Parametros invalidos." });
    }

    const found = await this.service.getById(id);
    if (!found) {
      return res.status(404).json({ message: "Item nao encontrado." });
    }

    return res.status(200).json({ data: toQuoteOnlyPhone(found) });
  };

  sync = async (_req: Request, res: Response) => {
    const result = await this.service.syncCatalog();
    return res.status(200).json(result);
  };
}
