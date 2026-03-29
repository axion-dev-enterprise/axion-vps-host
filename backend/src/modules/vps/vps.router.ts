import { Router } from "express";

import type { VpsController } from "./vps.controller";

export function createVpsRouter(controller: VpsController) {
  const router = Router();

  router.get("/plans", controller.plans);
  router.post("/orders", controller.createOrder);
  router.get("/orders/:id", controller.getOrder);

  return router;
}
