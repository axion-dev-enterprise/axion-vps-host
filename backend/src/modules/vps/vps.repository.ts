import { randomUUID } from "node:crypto";

import { createSqliteDatabase } from "../../lib/sqlite";
import type { VpsDashboard, VpsOrderEvent, VpsOrderInput, VpsOrderRecord } from "./vps.models";

type OrderRow = Omit<
  VpsOrderRecord,
  "installerName" | "installerEmail" | "domain" | "zoneName" | "zoneId" | "recordType" | "recordName" | "notes" | "recordContent" | "serverId" | "serverIp" | "serverRegion" | "rootUser" | "rootPassword" | "sshCommand" | "setupChecklist" | "failureReason"
> & {
  installerName: string | null;
  installerEmail: string | null;
  domain: string | null;
  zoneName: string | null;
  zoneId: string | null;
  recordType: string | null;
  recordName: string | null;
  notes: string | null;
  recordContent: string | null;
  serverId: string | null;
  serverIp: string | null;
  serverRegion: string | null;
  rootUser: string | null;
  rootPassword: string | null;
  sshCommand: string | null;
  setupChecklist: string | null;
  failureReason: string | null;
};

export class VpsRepository {
  private readonly db = createSqliteDatabase();

  createOrder(input: VpsOrderInput) {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    this.db
      .prepare(
        `
          INSERT INTO vps_orders (
            id, customerName, companyName, email, whatsapp, installerName, installerEmail, planId, billingCycle,
            status, domain, zoneName, zoneId, dnsMode, recordType, recordName, notes, toolkitPreference,
            createdAt, updatedAt
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'queued', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
      )
      .run(
        id,
        input.customerName,
        input.companyName,
        input.email,
        input.whatsapp,
        input.installerName ?? null,
        input.installerEmail ?? null,
        input.planId,
        input.billingCycle,
        input.domain ?? null,
        input.zoneName ?? null,
        input.zoneId ?? null,
        input.dnsMode,
        input.recordType ?? null,
        input.recordName ?? null,
        input.notes ?? null,
        input.toolkitPreference,
        createdAt,
        createdAt,
      );

    return this.getOrder(id)!;
  }

  listOrders() {
    const rows = this.db
      .prepare("SELECT * FROM vps_orders ORDER BY datetime(createdAt) DESC")
      .all() as OrderRow[];
    return rows.map((row) => this.mapOrder(row));
  }

  getOrder(id: string) {
    const row = this.db.prepare("SELECT * FROM vps_orders WHERE id = ?").get(id) as OrderRow | undefined;
    return row ? this.mapOrder(row) : null;
  }

  updateOrder(id: string, patch: Partial<VpsOrderRecord>) {
    const current = this.getOrder(id);
    if (!current) {
      return null;
    }

    const next: VpsOrderRecord = {
      ...current,
      ...patch,
      updatedAt: new Date().toISOString(),
    };

    this.db
      .prepare(
        `
          UPDATE vps_orders
          SET customerName = ?, companyName = ?, email = ?, whatsapp = ?, installerName = ?, installerEmail = ?,
              planId = ?, billingCycle = ?, status = ?, domain = ?, zoneName = ?, zoneId = ?, dnsMode = ?,
              recordType = ?, recordName = ?, recordContent = ?, notes = ?, toolkitPreference = ?, serverId = ?,
              serverIp = ?, serverRegion = ?, rootUser = ?, rootPassword = ?, sshCommand = ?, setupChecklist = ?,
              failureReason = ?, updatedAt = ?
          WHERE id = ?
        `,
      )
      .run(
        next.customerName,
        next.companyName,
        next.email,
        next.whatsapp,
        next.installerName ?? null,
        next.installerEmail ?? null,
        next.planId,
        next.billingCycle,
        next.status,
        next.domain ?? null,
        next.zoneName ?? null,
        next.zoneId ?? null,
        next.dnsMode,
        next.recordType ?? null,
        next.recordName ?? null,
        next.recordContent ?? null,
        next.notes ?? null,
        next.toolkitPreference,
        next.serverId ?? null,
        next.serverIp ?? null,
        next.serverRegion ?? null,
        next.rootUser ?? null,
        next.rootPassword ?? null,
        next.sshCommand ?? null,
        next.setupChecklist ?? null,
        next.failureReason ?? null,
        next.updatedAt,
        id,
      );

    return this.getOrder(id);
  }

  createEvent(orderId: string, type: string, message: string, payload?: string) {
    const id = randomUUID();
    const createdAt = new Date().toISOString();
    this.db
      .prepare(
        `
          INSERT INTO vps_order_events (id, orderId, type, message, payload, createdAt)
          VALUES (?, ?, ?, ?, ?, ?)
        `,
      )
      .run(id, orderId, type, message, payload ?? null, createdAt);

    return { id, orderId, type, message, payload, createdAt };
  }

  listEvents(orderId: string) {
    return this.db
      .prepare("SELECT * FROM vps_order_events WHERE orderId = ? ORDER BY datetime(createdAt) DESC")
      .all(orderId) as VpsOrderEvent[];
  }

  getDashboard(): VpsDashboard {
    const [total] = this.db.prepare("SELECT COUNT(*) AS value FROM vps_orders").all() as Array<{ value: number }>;
    const [active] = this.db
      .prepare("SELECT COUNT(*) AS value FROM vps_orders WHERE status IN ('queued', 'provisioning', 'dns_pending')")
      .all() as Array<{ value: number }>;
    const [ready] = this.db.prepare("SELECT COUNT(*) AS value FROM vps_orders WHERE status = 'ready' OR status = 'credentials_sent'").all() as Array<{ value: number }>;
    const [failed] = this.db.prepare("SELECT COUNT(*) AS value FROM vps_orders WHERE status = 'failed'").all() as Array<{ value: number }>;
    const [lastOrder] = this.db
      .prepare("SELECT createdAt FROM vps_orders ORDER BY datetime(createdAt) DESC LIMIT 1")
      .all() as Array<{ createdAt?: string }>;

    return {
      totalOrders: total?.value ?? 0,
      activeProvisioning: active?.value ?? 0,
      readyServers: ready?.value ?? 0,
      failedOrders: failed?.value ?? 0,
      lastOrderAt: lastOrder?.createdAt,
    };
  }

  private mapOrder(row: OrderRow): VpsOrderRecord {
    return {
      ...row,
      installerName: row.installerName ?? undefined,
      installerEmail: row.installerEmail ?? undefined,
      domain: row.domain ?? undefined,
      zoneName: row.zoneName ?? undefined,
      zoneId: row.zoneId ?? undefined,
      recordType: (row.recordType as VpsOrderRecord["recordType"]) ?? undefined,
      recordName: row.recordName ?? undefined,
      notes: row.notes ?? undefined,
      recordContent: row.recordContent ?? undefined,
      serverId: row.serverId ?? undefined,
      serverIp: row.serverIp ?? undefined,
      serverRegion: row.serverRegion ?? undefined,
      rootUser: row.rootUser ?? undefined,
      rootPassword: row.rootPassword ?? undefined,
      sshCommand: row.sshCommand ?? undefined,
      setupChecklist: row.setupChecklist ?? undefined,
      failureReason: row.failureReason ?? undefined,
    };
  }
}
