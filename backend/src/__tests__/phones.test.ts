import { listPhonesResponseSchema } from "@pontotecc/contract";
import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

import { getRuntimeEnv } from "../config/env";
import { createServer } from "../server";

test("GET /api/v1/phones returns seeded items", async () => {
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

  const res = await fetch(`http://127.0.0.1:${address.port}/api/v1/phones`);
  assert.equal(res.status, 200);
  const body = listPhonesResponseSchema.parse(await res.json());
  assert.ok(Array.isArray(body.data));
  assert.ok(body.meta.total >= 3);
  assert.ok(body.meta.availableBrands.length >= 3);
  assert.equal(body.data[0]?.quoteOnly, true);

  server.close();
});

test("GET /api/v1/phones/:id returns 404 for unknown id", async () => {
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

  const res = await fetch(`http://127.0.0.1:${address.port}/api/v1/phones/nope`);
  assert.equal(res.status, 404);

  server.close();
});
