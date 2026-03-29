import { getApiBaseUrl } from "@/lib/env";

type RequestOptions = {
  path: string;
  init?: RequestInit;
};

export async function fetchApiJson<T>({ path, init }: RequestOptions): Promise<T> {
  const response = await fetch(`${getApiBaseUrl()}${path}`, {
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status} ${response.statusText}`);
  }

  return (await response.json()) as T;
}
