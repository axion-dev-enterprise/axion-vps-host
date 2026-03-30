import "server-only";

export type ServerSpaceCreateInput = {
  planId: string;
  template: string;
  serverPlan: string;
  clientId: string;
  location?: string;
  serverName?: string;
  period?: string;
};

export type ServerSpaceServer = {
  id: string;
  name: string;
  status: string;
  template: string;
  plan: string;
  location: string;
  mock: boolean;
  requestedAt: string;
  request?: Record<string, unknown>;
  raw?: unknown;
};

export type ServerSpaceAction = "start" | "stop" | "restart";

const SERVERSPACE_BASE_URL = process.env.SERVERSPACE_API_BASE_URL || "https://api.serverspace.us";
const SERVERSPACE_PROJECT_ID = process.env.SERVERSPACE_PROJECT_ID || "566055";
const SERVERSPACE_API_KEY = process.env.SERVERSPACE_API_KEY || "";
const SERVERSPACE_MOCK_MODE = process.env.SERVERSPACE_MOCK_MODE !== "false";

function nowIso() {
  return new Date().toISOString();
}

function buildMockServerId() {
  return `mock-${Date.now()}`;
}

async function parseJson(response: Response) {
  const text = await response.text();
  if (!text) return null;
  try {
    return JSON.parse(text) as unknown;
  } catch {
    return { raw: text };
  }
}

function getHeaders() {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-API-KEY": SERVERSPACE_API_KEY,
  };
}

export function getServerSpaceConfig() {
  return {
    baseUrl: SERVERSPACE_BASE_URL,
    projectId: SERVERSPACE_PROJECT_ID,
    mockMode: SERVERSPACE_MOCK_MODE,
    hasApiKey: Boolean(SERVERSPACE_API_KEY),
  };
}

export async function createServer(input: ServerSpaceCreateInput): Promise<ServerSpaceServer> {
  const serverName = input.serverName || `${input.planId}-${input.clientId}`.replace(/[^a-zA-Z0-9-]/g, "-").slice(0, 48);
  const requestPayload = {
    projectId: SERVERSPACE_PROJECT_ID,
    name: serverName,
    location: input.location || "am2",
    image: input.template,
    plan: input.serverPlan,
    period: input.period || "month",
    metadata: {
      clientId: input.clientId,
      planId: input.planId,
    },
  };

  if (SERVERSPACE_MOCK_MODE) {
    return {
      id: buildMockServerId(),
      name: serverName,
      status: "queued_mock",
      template: input.template,
      plan: input.serverPlan,
      location: String(requestPayload.location),
      mock: true,
      requestedAt: nowIso(),
      request: requestPayload,
    };
  }

  const response = await fetch(`${SERVERSPACE_BASE_URL}/api/v1/projects/${SERVERSPACE_PROJECT_ID}/servers`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify(requestPayload),
    cache: "no-store",
  });

  const raw = await parseJson(response);
  if (!response.ok) {
    throw new Error(`ServerSpace create failed: ${response.status} ${response.statusText}`);
  }

  const server = raw && typeof raw === "object" && "server" in (raw as Record<string, unknown>)
    ? (raw as { server?: Record<string, unknown> }).server
    : undefined;

  return {
    id: String(server?.id || (raw as { id?: string } | null)?.id || buildMockServerId()),
    name: String(server?.name || requestPayload.name),
    status: String(server?.status || "queued"),
    template: input.template,
    plan: input.serverPlan,
    location: String(server?.location || requestPayload.location),
    mock: false,
    requestedAt: nowIso(),
    raw,
  };
}

export async function getServer(serverId: string) {
  if (SERVERSPACE_MOCK_MODE) {
    return {
      id: serverId,
      status: "running_mock",
      mock: true,
      checkedAt: nowIso(),
    };
  }

  const response = await fetch(`${SERVERSPACE_BASE_URL}/api/v1/projects/${SERVERSPACE_PROJECT_ID}/servers/${serverId}`, {
    method: "GET",
    headers: getHeaders(),
    cache: "no-store",
  });

  const raw = await parseJson(response);
  if (!response.ok) {
    throw new Error(`ServerSpace status failed: ${response.status} ${response.statusText}`);
  }

  return {
    id: serverId,
    mock: false,
    checkedAt: nowIso(),
    raw,
  };
}

export async function runServerAction(serverId: string, action: ServerSpaceAction) {
  if (SERVERSPACE_MOCK_MODE) {
    return {
      id: serverId,
      action,
      status: `${action}_accepted_mock`,
      mock: true,
      requestedAt: nowIso(),
    };
  }

  const response = await fetch(`${SERVERSPACE_BASE_URL}/api/v1/projects/${SERVERSPACE_PROJECT_ID}/servers/${serverId}/actions`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ action }),
    cache: "no-store",
  });

  const raw = await parseJson(response);
  if (!response.ok) {
    throw new Error(`ServerSpace action failed: ${response.status} ${response.statusText}`);
  }

  return {
    id: serverId,
    action,
    status: "accepted",
    mock: false,
    requestedAt: nowIso(),
    raw,
  };
}
