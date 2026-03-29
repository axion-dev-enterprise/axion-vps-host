import { Router } from "express";

import type { RuntimeEnv } from "../config/env";
import { createAdminRouter } from "../modules/admin/admin.router";
import { createPhonesRouter } from "../modules/phones/phones.router";
import { createQuoteRequestsRouter } from "../modules/quoteRequests/quoteRequests.router";
import { createSettingsRouter } from "../modules/settings/settings.router";
import { VpsController } from "../modules/vps/vps.controller";
import { VpsRepository } from "../modules/vps/vps.repository";
import { createVpsRouter } from "../modules/vps/vps.router";
import { VpsService } from "../modules/vps/vps.service";

export function createApiRouter(runtimeEnv: RuntimeEnv) {
  const router = Router();
  const vpsService = new VpsService(new VpsRepository(), runtimeEnv);
  const vpsController = new VpsController(vpsService);

  router.use("/phones", createPhonesRouter(runtimeEnv));
  router.use("/quote-requests", createQuoteRequestsRouter());
  router.use("/admin", createAdminRouter(runtimeEnv, vpsController));
  router.use("/settings", createSettingsRouter());
  router.use("/vps", createVpsRouter(vpsController));

  return router;
}

