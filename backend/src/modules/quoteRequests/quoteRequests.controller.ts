import { quoteRequestInputSchema } from "@pontotecc/contract";
import type { Request, Response } from "express";

import type { QuoteRequestsService } from "./quoteRequests.service";

export class QuoteRequestsController {
  constructor(private readonly service: QuoteRequestsService) {}

  create = async (req: Request, res: Response) => {
    const parsed = quoteRequestInputSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({ message: "Parametros invalidos.", issues: parsed.error.issues });
    }

    try {
      const created = await this.service.create(parsed.data);
      return res.status(201).json({
        ok: true,
        id: created.id,
        createdAt: created.createdAt,
      });
    } catch (error) {
      console.error("quote-request-create-failed", error);
      return res.status(500).json({ message: "Erro ao registrar solicitacao." });
    }
  };
}
