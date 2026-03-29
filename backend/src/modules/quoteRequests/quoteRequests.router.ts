import { Router } from "express";

import { QuoteRequestsController } from "./quoteRequests.controller";
import { QuoteRequestsRepository } from "./quoteRequests.repository";
import { QuoteRequestsService } from "./quoteRequests.service";

export function createQuoteRequestsRouter() {
  const router = Router();
  const repository = new QuoteRequestsRepository();
  const service = new QuoteRequestsService(repository);
  const controller = new QuoteRequestsController(service);

  router.post("/", controller.create);

  return router;
}
