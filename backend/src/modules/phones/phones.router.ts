import { Router } from "express";

import type { RuntimeEnv } from "../../config/env";
import { PhonesController } from "./phones.controller";
import { InMemoryPhonesRepository } from "./phones.repository";
import { SqlitePhonesRepository } from "./sqlite.repository";
import { PhonesService } from "./phones.service";

export function createPhonesRouter(runtimeEnv: RuntimeEnv) {
  const router = Router();

  const repo = runtimeEnv.NODE_ENV === "test" ? new InMemoryPhonesRepository() : new SqlitePhonesRepository();
  const service = new PhonesService(repo, {
    siteUrl: runtimeEnv.CATALOG_SITE_URL,
    searchTerms: runtimeEnv.CATALOG_SEARCH_TERMS.split(",").map((item) => item.trim()).filter(Boolean),
  });
  const controller = new PhonesController(service);

  router.post("/sync", controller.sync);
  router.get("/", controller.list);
  router.get("/:id", controller.getById);

  return router;
}

