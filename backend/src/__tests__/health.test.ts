import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

import { getRuntimeEnv } from "../config/env";
import { createServer } from "../server";

test("GET /health returns ok", async () => {
  const runtimeEnv = getRuntimeEnv({
    NODE_ENV: "test",
    PORT: "3001",
    CORS_ORIGIN: "http://localhost:3000",
  });
  const app = createServer(runtimeEnv);

  const server = http.createServer(app);
  await new Promise<void>((resolve) => server.listen(0, resolve));

  const address = server.address();
  if (!address || typeof address === "string") {
    server.close();
    throw new Error("Unable to resolve server address");
  }

  const res = await fetch(`http://127.0.0.1:${address.port}/health`);
  assert.equal(res.status, 200);
  assert.deepEqual(await res.json(), { ok: true });

  server.close();
});

