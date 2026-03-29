import { buildPhonesRoute } from "@pontotecc/contract";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import pinoHttp from "pino-http";

import type { RuntimeEnv } from "./config/env";
import { createApiRouter } from "./http/apiRouter";

export function createServer(runtimeEnv: RuntimeEnv) {
  const app = express();

  const allowedOrigins = String(runtimeEnv.CORS_ORIGIN)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin) {
          callback(null, true);
          return;
        }
        callback(null, allowedOrigins.includes(origin));
      },
      credentials: true,
    }),
  );

  app.use(
    pinoHttp({
      redact: {
        paths: ["req.headers.authorization", "req.headers.cookie"],
        remove: true,
      },
    }),
  );

  app.use(express.json({ limit: "2mb" }));

  app.get("/health", (_req, res) => {
    res.status(200).json({ ok: true });
  });

  app.get("/api", (_req, res) => {
    res.status(200).json({
      service: "pontotecc-api",
      version: "0.2.0",
      health: "/health",
      routes: {
        v1: "/api/v1",
        phones: buildPhonesRoute(),
        phoneDetail: buildPhonesRoute(":id"),
        syncPhones: `${buildPhonesRoute()}/sync`,
        quoteRequests: "/api/v1/quote-requests",
        admin: "/api/v1/admin",
        vps: "/api/v1/vps",
      },
    });
  });

  app.use("/api/v1", createApiRouter(runtimeEnv));

  app.use("/api/v1", (_req, res) => {
    res.status(404).json({ message: "Rota nao encontrada." });
  });

  app.use((_err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    void _next;
    res.status(500).json({ message: "Erro interno." });
  });

  return app;
}
