import { Router, type NextFunction, type Request, type Response } from "express";

import type { RuntimeEnv } from "../../config/env";
import { PhonesService } from "../phones/phones.service";
import { SqlitePhonesRepository } from "../phones/sqlite.repository";
import { AdminController } from "./admin.controller";
import { AdminRepository } from "./admin.repository";
import { AdminService } from "./admin.service";
import type { VpsController } from "../vps/vps.controller";

function parseCookie(headerValue?: string) {
  if (!headerValue) {
    return {};
  }

  return Object.fromEntries(
    headerValue
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const separatorIndex = part.indexOf("=");
        if (separatorIndex < 0) {
          return [part, ""];
        }

        return [part.slice(0, separatorIndex), decodeURIComponent(part.slice(separatorIndex + 1))];
      }),
  );
}

type AdminRequest = Request & {
  adminSession?: { email: string; expiresAt: string } | null;
  adminToken?: string | null;
};

export function createAdminRouter(runtimeEnv: RuntimeEnv, vpsController: VpsController) {
  const router = Router();
  const adminRepository = new AdminRepository();
  const phonesService = new PhonesService(new SqlitePhonesRepository(), {
    siteUrl: runtimeEnv.CATALOG_SITE_URL,
    searchTerms: runtimeEnv.CATALOG_SEARCH_TERMS.split(",").map((item) => item.trim()).filter(Boolean),
  });
  const service = new AdminService(adminRepository, phonesService, runtimeEnv);
  const controller = new AdminController(service);

  const requireAdmin = (req: AdminRequest, res: Response, next: NextFunction) => {
    const cookies = parseCookie(req.headers.cookie);
    const token = typeof cookies.pontotecc_admin_session === "string" ? cookies.pontotecc_admin_session : "";
    const session = token ? service.getSession(token) : null;

    req.adminToken = token || null;
    req.adminSession = session;

    if (!session) {
      return res.status(401).json({ message: "Sessão administrativa inválida." });
    }

    next();
  };

  router.post("/login", controller.login);
  router.post("/logout", requireAdmin, controller.logout);
  router.get("/session", requireAdmin, controller.session);

  router.get("/overview", requireAdmin, controller.overview);
  router.get("/products", requireAdmin, controller.listProducts);
  router.post("/products", requireAdmin, controller.createProduct);
  router.put("/products/:id", requireAdmin, controller.updateProduct);
  router.delete("/products/:id", requireAdmin, controller.deleteProduct);
  router.post("/products/sync", requireAdmin, controller.syncProducts);
  router.get("/quote-requests", requireAdmin, controller.listQuoteRequests);
  router.get("/settings", requireAdmin, controller.getSettings);
  router.put("/settings", requireAdmin, controller.updateSettings);
  router.get("/vps/dashboard", requireAdmin, vpsController.adminDashboard);
  router.get("/vps/orders", requireAdmin, vpsController.adminOrders);
  router.post("/vps/orders/:id/provision", requireAdmin, vpsController.adminProvision);
  router.post("/vps/orders/:id/dns", requireAdmin, vpsController.adminDns);
  router.post("/vps/orders/:id/send-installer-access", requireAdmin, vpsController.adminSendInstallerAccess);

  return router;
}
