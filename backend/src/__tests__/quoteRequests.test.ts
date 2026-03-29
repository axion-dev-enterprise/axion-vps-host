import assert from "node:assert/strict";
import http from "node:http";
import test from "node:test";

import { getRuntimeEnv } from "../config/env";
import { createServer } from "../server";

test("POST /api/v1/quote-requests creates a quote request", async () => {
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

  const res = await fetch(`http://127.0.0.1:${address.port}/api/v1/quote-requests`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: "Teste",
      email: "teste@example.com",
      phone: "11999999999",
      product: "Samsung Galaxy A55",
      message: "Quero detalhes",
      sourcePage: "/catalogo",
    }),
  });

  assert.equal(res.status, 201);
  const body = (await res.json()) as { ok: boolean; id: string; createdAt: string };
  assert.equal(body.ok, true);
  assert.equal(typeof body.id, "string");
  assert.ok(body.id.length > 0);
  assert.equal(typeof body.createdAt, "string");
  assert.ok(body.createdAt.length > 0);

  server.close();
});
