import { fetchApiJson } from "@/lib/api/http";

export type AdminSession = {
  email: string;
  expiresAt: string;
};

export type AdminOverview = {
  totalProducts: number;
  availableBrands: number;
  pendingQuotes: number;
  quotesToday: number;
  lastImportedAt?: string;
};

export type AdminProduct = {
  id: string;
  brand: string;
  model: string;
  storageGb: number;
  quoteOnly: boolean;
  imageUrl?: string;
  shortDescription?: string;
  importedAt?: string;
};

export type AdminQuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  product?: string;
  message: string;
  sourcePage?: string;
  createdAt: string;
};

export type AdminSettings = {
  businessName: string;
  supportEmail: string;
  whatsappNumber: string;
  whatsappUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  locationLabel: string;
  heroBadge: string;
  heroResponseTime: string;
  updatedAt: string;
};

export async function adminLogin(email: string, password: string) {
  return fetchApiJson<{ data: AdminSession }>({
    path: "/api/v1/admin/login",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    },
  });
}

export async function adminLogout() {
  return fetchApiJson<{ ok: true }>({
    path: "/api/v1/admin/logout",
    init: {
      method: "POST",
      credentials: "include",
    },
  });
}

export async function getAdminSession() {
  return fetchApiJson<{ data: AdminSession }>({
    path: "/api/v1/admin/session",
    init: { credentials: "include" },
  });
}

export async function getAdminOverview() {
  return fetchApiJson<{ data: AdminOverview }>({
    path: "/api/v1/admin/overview",
    init: { credentials: "include" },
  });
}

export async function getAdminProducts() {
  return fetchApiJson<{ data: AdminProduct[] }>({
    path: "/api/v1/admin/products",
    init: { credentials: "include" },
  });
}

export async function createAdminProduct(input: Omit<AdminProduct, "importedAt">) {
  return fetchApiJson<{ ok: true; id: string }>({
    path: "/api/v1/admin/products",
    init: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    },
  });
}

export async function updateAdminProduct(id: string, input: Omit<AdminProduct, "id" | "importedAt">) {
  return fetchApiJson<{ ok: true }>({
    path: `/api/v1/admin/products/${id}`,
    init: {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    },
  });
}

export async function deleteAdminProduct(id: string) {
  return fetchApiJson<{ ok: true }>({
    path: `/api/v1/admin/products/${id}`,
    init: {
      method: "DELETE",
      credentials: "include",
    },
  });
}

export async function syncAdminProducts() {
  return fetchApiJson<{ imported: number; source: string; terms: string[] }>({
    path: "/api/v1/admin/products/sync",
    init: {
      method: "POST",
      credentials: "include",
    },
  });
}

export async function getAdminQuoteRequests() {
  return fetchApiJson<{ data: AdminQuoteRequest[] }>({
    path: "/api/v1/admin/quote-requests",
    init: { credentials: "include" },
  });
}

export async function getAdminSettings() {
  return fetchApiJson<{ data: AdminSettings }>({
    path: "/api/v1/admin/settings",
    init: { credentials: "include" },
  });
}

export async function updateAdminSettings(input: Omit<AdminSettings, "updatedAt">) {
  return fetchApiJson<{ ok: true }>({
    path: "/api/v1/admin/settings",
    init: {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
      credentials: "include",
    },
  });
}
