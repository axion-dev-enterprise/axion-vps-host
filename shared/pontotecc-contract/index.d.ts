export interface Phone {
  id: string;
  brand: string;
  model: string;
  storageGb: number;
  priceCents?: number;
  quoteOnly: boolean;
  imageUrl?: string;
  shortDescription?: string;
}

export interface ListPhonesQuery {
  q?: string;
  brand?: string;
  minPriceCents?: number;
  maxPriceCents?: number;
  page: number;
  pageSize: number;
}

export interface PhonesCollectionMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  availableBrands: string[];
}

export interface ListPhonesResponse {
  data: Phone[];
  meta: PhonesCollectionMeta;
}

export interface PhoneDetailResponse {
  data: Phone;
}

export interface QuoteRequestInput {
  name: string;
  email: string;
  phone: string;
  product?: string;
  message: string;
  sourcePage?: string;
}

export interface QuoteRequestResponse {
  ok: true;
  id: string;
  createdAt: string;
}

export interface ContractIssue {
  path: Array<string | number>;
  message: string;
}

export interface SafeParseError {
  issues: ContractIssue[];
}

export interface ContractSchema<T> {
  parse(input: unknown): T;
  safeParse(input: unknown): { success: true; data: T } | { success: false; error: SafeParseError };
}

export declare const PHONE_PAGE_SIZE_DEFAULT: number;
export declare const PHONE_PAGE_SIZE_MAX: number;
export declare const phoneSchema: ContractSchema<Phone>;
export declare const listPhonesQuerySchema: ContractSchema<ListPhonesQuery>;
export declare const phonesCollectionMetaSchema: ContractSchema<PhonesCollectionMeta>;
export declare const listPhonesResponseSchema: ContractSchema<ListPhonesResponse>;
export declare const phoneDetailResponseSchema: ContractSchema<PhoneDetailResponse>;
export declare const quoteRequestInputSchema: ContractSchema<QuoteRequestInput>;
export declare function buildPhonesRoute(phoneId?: string): string;
