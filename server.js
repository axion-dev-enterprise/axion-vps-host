import http from "node:http";
import { spawn } from "node:child_process";
import { fileURLToPath, parse } from "node:url";

import next from "next";

const port = Number.parseInt(process.env.PORT || "3000", 10);
const hostname = process.env.HOSTNAME || "0.0.0.0";
const dev = process.env.NODE_ENV !== "production";
const backendPort = Number.parseInt(process.env.BACKEND_PORT || "3001", 10);
const backendOrigin = new URL(process.env.PONTOTECC_API_BASE_URL || `http://127.0.0.1:${backendPort}`);
let backendProcess = null;

function ensureEmbeddedBackend() {
  if (dev || process.env.DISABLE_EMBEDDED_BACKEND === "true") {
    return;
  }

  if (backendProcess) {
    return;
  }

  const backendEntry = fileURLToPath(new URL("./backend/dist/index.js", import.meta.url));
  const backendCwd = fileURLToPath(new URL("./backend/", import.meta.url));
  backendProcess = spawn(process.execPath, [backendEntry], {
    cwd: backendCwd,
    env: {
      ...process.env,
      PORT: String(backendPort),
      NODE_ENV: process.env.NODE_ENV || "production",
    },
    stdio: "inherit",
  });

  backendProcess.on("exit", () => {
    backendProcess = null;
  });
}

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

function proxyToBackend(req, res) {
  const targetPath = req.url || "/";
  const proxyRequest = http.request(
    {
      hostname: backendOrigin.hostname,
      port: backendOrigin.port,
      path: targetPath,
      method: req.method,
      headers: {
        ...req.headers,
        host: backendOrigin.host,
      },
    },
    (proxyResponse) => {
      res.writeHead(proxyResponse.statusCode || 502, proxyResponse.headers);
      proxyResponse.pipe(res);
    },
  );

  proxyRequest.on("error", () => {
    res.statusCode = 502;
    res.setHeader("content-type", "application/json; charset=utf-8");
    res.end(JSON.stringify({ message: "Backend indisponivel." }));
  });

  req.pipe(proxyRequest);
}

app
  .prepare()
  .then(() => {
    ensureEmbeddedBackend();

    const shutdown = () => {
      if (backendProcess) {
        backendProcess.kill("SIGTERM");
      }
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);

    http
      .createServer((req, res) => {
        const parsedUrl = parse(req.url || "/", true);

        if (parsedUrl.pathname === "/health") {
          res.statusCode = 200;
          res.setHeader("content-type", "application/json; charset=utf-8");
          res.end(JSON.stringify({ ok: true }));
          return;
        }

        if (parsedUrl.pathname?.startsWith("/api/") || parsedUrl.pathname === "/api") {
          proxyToBackend(req, res);
          return;
        }

        if (parsedUrl.pathname === "/health-api") {
          req.url = "/health";
          proxyToBackend(req, res);
          return;
        }

        handle(req, res, parsedUrl);
      })
      .listen(port, hostname);
  })
  .catch((err) => {
    process.stderr.write(String(err) + "\n");
    process.exit(1);
  });
