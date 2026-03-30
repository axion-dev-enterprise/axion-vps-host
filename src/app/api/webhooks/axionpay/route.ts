import { readFile, writeFile, mkdir } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

const AXIONPAY_API_KEY = "axionpay_test_2f9d65282dc5471db92ca58198d55b20";

type WebhookPayload = {
  plan_id?: string;
  client_email?: string;
  payment_status?: string;
};

type ClientServerRecord = {
  plan_id: string;
  client_email: string;
  payment_status: string;
  created_at: string;
};

async function readClientServers(filePath: string): Promise<ClientServerRecord[]> {
  try {
    const content = await readFile(filePath, "utf8");
    const parsed = JSON.parse(content);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function POST(request: Request) {
  const apiKey = request.headers.get("x-api-key");

  if (apiKey !== AXIONPAY_API_KEY) {
    return Response.json({ success: false, error: "unauthorized" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as WebhookPayload | null;

  if (!payload) {
    return Response.json({ success: false, error: "invalid_json" }, { status: 400 });
  }

  const { plan_id = "", client_email = "", payment_status = "" } = payload;

  if (payment_status === "paid") {
    const filePath = path.join(process.cwd(), "data", "client-servers.json");
    const current = await readClientServers(filePath);

    current.push({
      plan_id,
      client_email,
      payment_status,
      created_at: new Date().toISOString(),
    });

    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, `${JSON.stringify(current, null, 2)}\n`, "utf8");
    console.log("provisionar via ServerSpace", { plan_id, client_email });
  }

  return Response.json({ success: true });
}
