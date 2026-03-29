import type { Phone } from "../phones/phones.models";

export type AdminSettings = {
  businessName: string;
  supportEmail: string;
  whatsappNumber: string;
  whatsappUrl: string;
  instagramUrl: string;
  facebookUrl: string;
  locationLabel: string;
  heroBadge: string;
  heroResponseTime: string;
  updatedAt: string;
};

export type AdminQuoteRequest = {
  id: string;
  name: string;
  email: string;
  phone: string;
  product?: string;
  message: string;
  sourcePage?: string;
  createdAt: string;
};

export type AdminOverview = {
  totalProducts: number;
  availableBrands: number;
  pendingQuotes: number;
  quotesToday: number;
  lastImportedAt?: string;
};

export type AdminLoginInput = {
  email: string;
  password: string;
};

export type AdminSession = {
  email: string;
  expiresAt: string;
};

export type AdminPhoneInput = Omit<Phone, "id" | "quoteOnly"> & {
  id?: string;
  quoteOnly?: boolean;
};
