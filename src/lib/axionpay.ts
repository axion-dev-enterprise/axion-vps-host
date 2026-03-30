export const AXION_PAY_BASE_URL = process.env.AXION_PAY_BASE_URL || "https://pay.axionenterprise.cloud";
const AXION_PAY_WEBHOOK_API_KEY = process.env.AXION_PAY_WEBHOOK_API_KEY || "axionpay_test_2f9d65282dc5471db92ca58198d55b20";

export type AxionPayWebhookPayload = {
  event?: string;
  type?: string;
  status?: string;
  payment_status?: string;
  approved?: boolean;
  slug?: string;
  plan_id?: string;
  metadata?: Record<string, unknown>;
  customer?: {
    id?: string;
    email?: string;
    name?: string;
  };
  buyer?: {
    email?: string;
    name?: string;
  };
  subscription?: {
    id?: string;
    plan_id?: string;
  };
  checkout?: {
    slug?: string;
  };
  product?: {
    id?: string;
    slug?: string;
    name?: string;
    plan_id?: string;
  };
  items?: Array<{
    id?: string;
    slug?: string;
    name?: string;
    plan_id?: string;
    metadata?: Record<string, unknown>;
  }>;
  [key: string]: unknown;
};

export function getAxionPayCheckoutSlug(planId: string) {
  return planId.startsWith("vps-") ? planId : `vps-${planId}`;
}

export function getAxionPayCheckoutUrl(planId: string) {
  return `${AXION_PAY_BASE_URL}/checkout/${getAxionPayCheckoutSlug(planId)}`;
}

export function isAxionPayWebhookAuthorized(headers: Headers) {
  const candidates = [
    headers.get("x-axionpay-api-key"),
    headers.get("x-api-key"),
    headers.get("authorization")?.replace(/^Bearer\s+/i, ""),
  ].filter(Boolean);

  return candidates.includes(AXION_PAY_WEBHOOK_API_KEY);
}

function asRecord(value: unknown): Record<string, unknown> | undefined {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : undefined;
}

function readString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

export function extractPlanIdFromWebhook(payload: AxionPayWebhookPayload) {
  const metadata = asRecord(payload.metadata);
  const item = payload.items?.[0];
  const itemMetadata = asRecord(item?.metadata);
  const raw =
    readString(payload.plan_id) ||
    readString(metadata?.plan_id) ||
    readString(payload.subscription?.plan_id) ||
    readString(payload.product?.plan_id) ||
    readString(item?.plan_id) ||
    readString(itemMetadata?.plan_id) ||
    normalizeSlugToPlanId(readString(payload.slug) || readString(payload.checkout?.slug) || readString(payload.product?.slug) || readString(item?.slug));

  return raw;
}

export function extractClientIdFromWebhook(payload: AxionPayWebhookPayload) {
  const metadata = asRecord(payload.metadata);
  return (
    readString(payload.customer?.email) ||
    readString(payload.buyer?.email) ||
    readString(payload.customer?.id) ||
    readString(metadata?.client_id) ||
    readString(metadata?.customer_id) ||
    "unknown-client"
  );
}

export function isPaidWebhook(payload: AxionPayWebhookPayload) {
  const flags = [payload.status, payload.payment_status, payload.event, payload.type]
    .filter((value): value is string => typeof value === "string")
    .map((value) => value.toLowerCase());

  if (payload.approved === true) {
    return true;
  }

  return flags.some((value) => ["paid", "payment.approved", "payment_confirmed", "invoice.paid", "charge.paid", "subscription.paid", "approved"].includes(value));
}

export function normalizeSlugToPlanId(slug?: string) {
  if (!slug) return undefined;
  if (slug.startsWith("vps-")) {
    return slug;
  }
  return slug;
}
