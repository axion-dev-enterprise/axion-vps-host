import { randomUUID } from "node:crypto";

import { createSqliteDatabase } from "../../lib/sqlite";
import type { QuoteRequestInput, QuoteRequestRecord } from "./quoteRequests.models";

export class QuoteRequestsRepository {
  private readonly db = createSqliteDatabase();

  async create(input: QuoteRequestInput): Promise<QuoteRequestRecord> {
    const id = randomUUID();
    const createdAt = new Date().toISOString();

    this.db
      .prepare(
        `
          INSERT INTO quote_requests (
            id, name, email, phone, product, message, sourcePage, createdAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        id,
        input.name,
        input.email,
        input.phone,
        input.product ?? null,
        input.message,
        input.sourcePage ?? null,
        createdAt,
      );

    return {
      id,
      createdAt,
      ...input,
    };
  }
}
