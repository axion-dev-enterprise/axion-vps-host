import {
  buildPhonesRoute,
  listPhonesResponseSchema,
  type ListPhonesResponse,
  type ListPhonesQuery,
} from "@pontotecc/contract";

import { fetchApiJson } from "@/lib/api/http";

function buildQueryString(query: Partial<ListPhonesQuery>) {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== "") {
      params.set(key, String(value));
    }
  });

  const queryString = params.toString();
  return queryString ? `?${queryString}` : "";
}

export async function getPhonesCatalog(query: Partial<ListPhonesQuery>) {
  const response = await fetchApiJson<ListPhonesResponse>({
    path: `${buildPhonesRoute()}${buildQueryString(query)}`,
  });

  return listPhonesResponseSchema.parse(response);
}
