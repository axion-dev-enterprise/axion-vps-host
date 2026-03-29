import { randomUUID } from "node:crypto";

import { createSqliteDatabase } from "../../lib/sqlite";
import type { AdminOverview, AdminPhoneInput, AdminQuoteRequest, AdminSession, AdminSettings } from "./admin.models";

type PhoneRow = {
  id: string;
  brand: string;
  model: string;
  storageGb: number;
  priceCents: number;
  quoteOnly: number;
  imageUrl: string | null;
  shortDescription: string | null;
  importedAt: string | null;
};

type SettingsRow = Omit<AdminSettings, "updatedAt"> & { id: string; updatedAt: string };

export class AdminRepository {
  private readonly db = createSqliteDatabase();

  listProducts() {
    const rows = this.db
      .prepare(
        `
          SELECT id, brand, model, storageGb, priceCents, quoteOnly, imageUrl, shortDescription, importedAt
          FROM phones
          ORDER BY importedAt DESC, brand ASC, model ASC
        `,
      )
      .all() as PhoneRow[];

    return rows.map((row) => ({
      id: row.id,
      brand: row.brand,
      model: row.model,
      storageGb: row.storageGb,
      priceCents: row.priceCents,
      quoteOnly: Boolean(row.quoteOnly),
      imageUrl: row.imageUrl ?? undefined,
      shortDescription: row.shortDescription ?? undefined,
      importedAt: row.importedAt ?? undefined,
    }));
  }

  createProduct(input: AdminPhoneInput) {
    const id = input.id?.trim() || randomUUID();
    this.db
      .prepare(
        `
          INSERT INTO phones (
            id, brand, model, storageGb, priceCents, quoteOnly, imageUrl, shortDescription, source, importedAt, createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'manual', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `,
      )
      .run(
        id,
        input.brand,
        input.model,
        input.storageGb,
        input.priceCents ?? 0,
        input.quoteOnly === false ? 0 : 1,
        input.imageUrl ?? null,
        input.shortDescription ?? null,
      );

    return id;
  }

  updateProduct(id: string, input: AdminPhoneInput) {
    this.db
      .prepare(
        `
          UPDATE phones
          SET brand = ?, model = ?, storageGb = ?, priceCents = ?, quoteOnly = ?, imageUrl = ?, shortDescription = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = ?
        `,
      )
      .run(
        input.brand,
        input.model,
        input.storageGb,
        input.priceCents ?? 0,
        input.quoteOnly === false ? 0 : 1,
        input.imageUrl ?? null,
        input.shortDescription ?? null,
        id,
      );
  }

  deleteProduct(id: string) {
    this.db.prepare("DELETE FROM phones WHERE id = ?").run(id);
  }

  listQuoteRequests(): AdminQuoteRequest[] {
    return this.db
      .prepare(
        `
          SELECT id, name, email, phone, product, message, sourcePage, createdAt
          FROM quote_requests
          ORDER BY createdAt DESC
        `,
      )
      .all() as AdminQuoteRequest[];
  }

  getSettings(): AdminSettings {
    const row = this.db
      .prepare(
        `
          SELECT id, businessName, supportEmail, whatsappNumber, whatsappUrl, instagramUrl, facebookUrl, locationLabel, heroBadge, heroResponseTime, updatedAt
          FROM admin_settings
          WHERE id = 'default'
        `,
      )
      .get() as SettingsRow;

    return {
      businessName: row.businessName,
      supportEmail: row.supportEmail,
      whatsappNumber: row.whatsappNumber,
      whatsappUrl: row.whatsappUrl,
      instagramUrl: row.instagramUrl,
      facebookUrl: row.facebookUrl,
      locationLabel: row.locationLabel,
      heroBadge: row.heroBadge,
      heroResponseTime: row.heroResponseTime,
      updatedAt: row.updatedAt,
    };
  }

  updateSettings(input: Omit<AdminSettings, "updatedAt">) {
    this.db
      .prepare(
        `
          UPDATE admin_settings
          SET businessName = ?, supportEmail = ?, whatsappNumber = ?, whatsappUrl = ?, instagramUrl = ?, facebookUrl = ?, locationLabel = ?, heroBadge = ?, heroResponseTime = ?, updatedAt = CURRENT_TIMESTAMP
          WHERE id = 'default'
        `,
      )
      .run(
        input.businessName,
        input.supportEmail,
        input.whatsappNumber,
        input.whatsappUrl,
        input.instagramUrl,
        input.facebookUrl,
        input.locationLabel,
        input.heroBadge,
        input.heroResponseTime,
      );
  }

  getOverview(): AdminOverview {
    const [products] = this.db.prepare("SELECT COUNT(*) as total FROM phones").all() as Array<{ total: number }>;
    const [brands] = this.db.prepare("SELECT COUNT(DISTINCT brand) as total FROM phones").all() as Array<{ total: number }>;
    const [quotes] = this.db.prepare("SELECT COUNT(*) as total FROM quote_requests").all() as Array<{ total: number }>;
    const [today] = this.db
      .prepare("SELECT COUNT(*) as total FROM quote_requests WHERE date(createdAt) = date('now', 'localtime')")
      .all() as Array<{ total: number }>;
    const [latestImport] = this.db
      .prepare("SELECT importedAt FROM phones ORDER BY importedAt DESC LIMIT 1")
      .all() as Array<{ importedAt?: string }>;

    return {
      totalProducts: products?.total ?? 0,
      availableBrands: brands?.total ?? 0,
      pendingQuotes: quotes?.total ?? 0,
      quotesToday: today?.total ?? 0,
      lastImportedAt: latestImport?.importedAt,
    };
  }

  createSession(email: string, expiresAt: string) {
    const token = randomUUID();
    this.db.prepare("INSERT INTO admin_sessions (token, email, expiresAt) VALUES (?, ?, ?)").run(token, email, expiresAt);
    return token;
  }

  getSession(token: string): AdminSession | null {
    this.db.prepare("DELETE FROM admin_sessions WHERE datetime(expiresAt) <= datetime('now')").run();
    const row = this.db
      .prepare("SELECT email, expiresAt FROM admin_sessions WHERE token = ?")
      .get(token) as AdminSession | undefined;

    return row ?? null;
  }

  deleteSession(token: string) {
    this.db.prepare("DELETE FROM admin_sessions WHERE token = ?").run(token);
  }
}
