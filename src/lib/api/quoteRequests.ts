import { quoteRequestInputSchema, type QuoteRequestInput, type QuoteRequestResponse } from "@pontotecc/contract";

import { fetchApiJson } from "@/lib/api/http";

export async function createQuoteRequest(input: QuoteRequestInput) {
  const payload = quoteRequestInputSchema.parse(input);

  return fetchApiJson<QuoteRequestResponse>({
    path: "/api/v1/quote-requests",
    init: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  });
}
