import { createSqliteDatabase } from "../../lib/sqlite";
import type { ListPhonesParams, ListPhonesResult, Phone } from "./phones.models";
import type { PhonesRepository } from "./phones.repository";

type PhoneRow = {
  id: string;
  brand: string;
  model: string;
  storageGb: number;
  priceCents: number;
  quoteOnly: number;
  imageUrl: string | null;
  shortDescription: string | null;
};

export class SqlitePhonesRepository implements PhonesRepository {
  private readonly db = createSqliteDatabase();

  private getPhonePriceCents(phone: Phone) {
    return phone.priceCents ?? 0;
  }

  private mapRow(row: PhoneRow): Phone {
    return {
      id: row.id,
      brand: row.brand,
      model: row.model,
      storageGb: row.storageGb,
      priceCents: row.priceCents,
      quoteOnly: Boolean(row.quoteOnly),
      imageUrl: row.imageUrl ?? undefined,
      shortDescription: row.shortDescription ?? undefined,
    };
  }

  async list(params: ListPhonesParams): Promise<ListPhonesResult> {
    const rows = this.db
      .prepare(
        `
          SELECT id, brand, model, storageGb, priceCents, quoteOnly, imageUrl, shortDescription
          FROM phones
          ORDER BY importedAt DESC, brand ASC, model ASC
        `,
      )
      .all() as PhoneRow[];

    const phones = rows.map((row) => this.mapRow(row));
    const normalizedQ = params.q?.trim().toLowerCase();
    const normalizedBrand = params.brand?.trim().toLowerCase();
    const availableBrands = [...new Set(phones.map((phone) => phone.brand))].sort((left, right) =>
      left.localeCompare(right),
    );
    const filtered = phones.filter((phone) => {
      if (normalizedBrand && phone.brand.toLowerCase() !== normalizedBrand) {
        return false;
      }

      if (typeof params.minPriceCents === "number" && this.getPhonePriceCents(phone) < params.minPriceCents) {
        return false;
      }

      if (typeof params.maxPriceCents === "number" && this.getPhonePriceCents(phone) > params.maxPriceCents) {
        return false;
      }

      if (!normalizedQ) {
        return true;
      }

      const haystack = `${phone.brand} ${phone.model} ${phone.storageGb}`.toLowerCase();
      return haystack.includes(normalizedQ);
    });

    const total = filtered.length;
    const totalPages = total === 0 ? 0 : Math.ceil(total / params.pageSize);
    const start = (params.page - 1) * params.pageSize;
    const data = filtered.slice(start, start + params.pageSize);

    return {
      data,
      meta: {
        page: params.page,
        pageSize: params.pageSize,
        total,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPreviousPage: params.page > 1,
        availableBrands,
      },
    };
  }

  async getById(id: string): Promise<Phone | null> {
    const row = this.db
      .prepare(
        `
          SELECT id, brand, model, storageGb, priceCents, quoteOnly, imageUrl, shortDescription
          FROM phones
          WHERE id = ?
        `,
      )
      .get(id) as PhoneRow | undefined;

    return row ? this.mapRow(row) : null;
  }

  async replaceCatalog(phones: Phone[]): Promise<number> {
    this.db.exec("BEGIN");

    try {
      this.db.prepare("DELETE FROM phones").run();
      const insert = this.db.prepare(`
        INSERT INTO phones (
          id, brand, model, storageGb, priceCents, quoteOnly, imageUrl, shortDescription, source, importedAt, createdAt, updatedAt
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'mercadolivre', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
      `);

      for (const phone of phones) {
        insert.run(
          phone.id,
          phone.brand,
          phone.model,
          phone.storageGb,
          this.getPhonePriceCents(phone),
          phone.quoteOnly ? 1 : 0,
          phone.imageUrl ?? null,
          phone.shortDescription ?? null,
        );
      }

      this.db.exec("COMMIT");
      return phones.length;
    } catch (error) {
      this.db.exec("ROLLBACK");
      throw error;
    }
  }
}
