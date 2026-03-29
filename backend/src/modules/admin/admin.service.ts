import type { RuntimeEnv } from "../../config/env";
import type { PhonesService } from "../phones/phones.service";
import type { AdminPhoneInput, AdminSettings } from "./admin.models";
import { AdminRepository } from "./admin.repository";

export class AdminService {
  constructor(
    private readonly repository: AdminRepository,
    private readonly phonesService: PhonesService,
    private readonly runtimeEnv: RuntimeEnv,
  ) {}

  getOverview() {
    return this.repository.getOverview();
  }

  listProducts() {
    return this.repository.listProducts();
  }

  createProduct(input: AdminPhoneInput) {
    return this.repository.createProduct(input);
  }

  updateProduct(id: string, input: AdminPhoneInput) {
    return this.repository.updateProduct(id, input);
  }

  deleteProduct(id: string) {
    return this.repository.deleteProduct(id);
  }

  syncProducts() {
    return this.phonesService.syncCatalog();
  }

  listQuoteRequests() {
    return this.repository.listQuoteRequests();
  }

  getSettings() {
    return this.repository.getSettings();
  }

  updateSettings(input: Omit<AdminSettings, "updatedAt">) {
    return this.repository.updateSettings(input);
  }

  login(email: string, password: string) {
    if (email !== this.runtimeEnv.ADMIN_EMAIL || password !== this.runtimeEnv.ADMIN_PASSWORD) {
      return null;
    }

    const expiresAt = new Date(Date.now() + this.runtimeEnv.ADMIN_SESSION_HOURS * 60 * 60 * 1000).toISOString();
    const token = this.repository.createSession(email, expiresAt);

    return {
      token,
      expiresAt,
      email,
    };
  }

  getSession(token: string) {
    return this.repository.getSession(token);
  }

  logout(token: string) {
    return this.repository.deleteSession(token);
  }
}
