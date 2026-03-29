import { fetchApiJson } from "@/lib/api/http";
import type { AdminSettings } from "@/lib/api/admin";

export async function getPublicSettings() {
  return fetchApiJson<{ data: AdminSettings }>({
    path: "/api/v1/settings",
  });
}
