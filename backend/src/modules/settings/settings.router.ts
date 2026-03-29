import { Router } from "express";

import { SettingsController } from "./settings.controller";

export function createSettingsRouter() {
  const router = Router();
  const controller = new SettingsController();

  router.get("/", controller.get);

  return router;
}
