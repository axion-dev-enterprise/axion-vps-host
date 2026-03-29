import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { DatabaseSync } from "node:sqlite";

const DEFAULT_DATABASE_URL = "file:./prisma/dev.db";

function resolveDatabasePath(databaseUrl: string) {
  const normalized = databaseUrl.replace(/^file:/, "");
  return resolve(process.cwd(), normalized);
}

export function getDatabasePath(databaseUrl = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL) {
  return resolveDatabasePath(databaseUrl);
}

export function createSqliteDatabase(databaseUrl = process.env.DATABASE_URL ?? DEFAULT_DATABASE_URL) {
  const databasePath = getDatabasePath(databaseUrl);
  mkdirSync(dirname(databasePath), { recursive: true });

  const db = new DatabaseSync(databasePath);
  db.exec(`
    CREATE TABLE IF NOT EXISTS phones (
      id TEXT PRIMARY KEY,
      brand TEXT NOT NULL,
      model TEXT NOT NULL,
      storageGb INTEGER NOT NULL,
      priceCents INTEGER NOT NULL DEFAULT 0,
      quoteOnly INTEGER NOT NULL DEFAULT 1,
      imageUrl TEXT,
      listingUrl TEXT,
      source TEXT NOT NULL DEFAULT 'mercadolivre',
      importedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      shortDescription TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_phones_brand ON phones(brand);
    CREATE INDEX IF NOT EXISTS idx_phones_model ON phones(model);
    CREATE INDEX IF NOT EXISTS idx_phones_importedAt ON phones(importedAt);

    CREATE TABLE IF NOT EXISTS quote_requests (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      product TEXT,
      message TEXT NOT NULL,
      sourcePage TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_quote_requests_createdAt ON quote_requests(createdAt);

    CREATE TABLE IF NOT EXISTS vps_orders (
      id TEXT PRIMARY KEY,
      customerName TEXT NOT NULL,
      companyName TEXT NOT NULL,
      email TEXT NOT NULL,
      whatsapp TEXT NOT NULL,
      installerName TEXT,
      installerEmail TEXT,
      planId TEXT NOT NULL,
      billingCycle TEXT NOT NULL DEFAULT 'monthly',
      status TEXT NOT NULL DEFAULT 'pending_review',
      domain TEXT,
      zoneName TEXT,
      zoneId TEXT,
      dnsMode TEXT NOT NULL DEFAULT 'none',
      recordType TEXT,
      recordName TEXT,
      recordContent TEXT,
      notes TEXT,
      toolkitPreference TEXT NOT NULL DEFAULT 'managed',
      serverId TEXT,
      serverIp TEXT,
      serverRegion TEXT,
      rootUser TEXT,
      rootPassword TEXT,
      sshCommand TEXT,
      setupChecklist TEXT,
      failureReason TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_vps_orders_status ON vps_orders(status);
    CREATE INDEX IF NOT EXISTS idx_vps_orders_createdAt ON vps_orders(createdAt);

    CREATE TABLE IF NOT EXISTS vps_order_events (
      id TEXT PRIMARY KEY,
      orderId TEXT NOT NULL,
      type TEXT NOT NULL,
      message TEXT NOT NULL,
      payload TEXT,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_vps_order_events_orderId ON vps_order_events(orderId, createdAt);

    CREATE TABLE IF NOT EXISTS admin_settings (
      id TEXT PRIMARY KEY,
      businessName TEXT NOT NULL,
      supportEmail TEXT NOT NULL,
      whatsappNumber TEXT NOT NULL,
      whatsappUrl TEXT NOT NULL,
      instagramUrl TEXT NOT NULL,
      facebookUrl TEXT NOT NULL,
      locationLabel TEXT NOT NULL,
      heroBadge TEXT NOT NULL,
      heroResponseTime TEXT NOT NULL,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      email TEXT NOT NULL,
      expiresAt TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiresAt ON admin_sessions(expiresAt);
  `);

  db.prepare(
    `
      INSERT OR IGNORE INTO admin_settings (
        id, businessName, supportEmail, whatsappNumber, whatsappUrl, instagramUrl, facebookUrl, locationLabel, heroBadge, heroResponseTime, updatedAt
      ) VALUES (
        'default',
        'AXION VPS',
        'infra@axionenterprise.cloud',
        '(11) 93333-1462',
        'https://wa.me/5511933331462',
        'https://instagram.com/axionenterprise',
        'https://facebook.com/axionenterprise',
        'Provisionamento remoto para todo o Brasil',
        'Provisionamento simples para quem nao quer perder tempo com terminal',
        '5 min',
        CURRENT_TIMESTAMP
      )
    `,
  ).run();

  return db;
}
