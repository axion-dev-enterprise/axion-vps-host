"use strict";

const PHONE_PAGE_SIZE_DEFAULT = 12;
const PHONE_PAGE_SIZE_MAX = 48;

function createSchema(parseValue) {
  return {
    parse(input) {
      const result = parseValue(input);
      if (!result.success) {
        const error = new Error("Invalid contract payload");
        error.issues = result.error.issues;
        throw error;
      }

      return result.data;
    },
    safeParse(input) {
      return parseValue(input);
    },
  };
}

function createIssue(path, message) {
  return { path, message };
}

function normalizeOptionalText(value) {
  if (typeof value !== "string") {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
}

function normalizePositiveInt(value, field, { min = 0, max } = {}) {
  if (value === undefined || value === null || value === "") {
    return { ok: true, value: undefined };
  }

  const numeric = Number(value);
  if (!Number.isInteger(numeric)) {
    return { ok: false, issue: createIssue([field], `${field} must be an integer`) };
  }

  if (numeric < min) {
    return { ok: false, issue: createIssue([field], `${field} must be greater than or equal to ${min}`) };
  }

  if (typeof max === "number" && numeric > max) {
    return { ok: false, issue: createIssue([field], `${field} must be less than or equal to ${max}`) };
  }

  return { ok: true, value: numeric };
}

const phoneSchema = createSchema((input) => {
  const issues = [];
  const source = input && typeof input === "object" ? input : {};

  const phone = {
    id: typeof source.id === "string" ? source.id.trim() : "",
    brand: typeof source.brand === "string" ? source.brand.trim() : "",
    model: typeof source.model === "string" ? source.model.trim() : "",
    storageGb: Number(source.storageGb),
    priceCents:
      source.priceCents === undefined || source.priceCents === null || source.priceCents === ""
        ? undefined
        : Number(source.priceCents),
    quoteOnly: source.quoteOnly !== false,
    imageUrl: normalizeOptionalText(source.imageUrl),
    shortDescription: normalizeOptionalText(source.shortDescription),
  };

  if (!phone.id) issues.push(createIssue(["id"], "id is required"));
  if (!phone.brand) issues.push(createIssue(["brand"], "brand is required"));
  if (!phone.model) issues.push(createIssue(["model"], "model is required"));
  if (!Number.isInteger(phone.storageGb) || phone.storageGb <= 0) {
    issues.push(createIssue(["storageGb"], "storageGb must be a positive integer"));
  }
  if (
    phone.priceCents !== undefined &&
    (!Number.isInteger(phone.priceCents) || phone.priceCents < 0)
  ) {
    issues.push(createIssue(["priceCents"], "priceCents must be a non-negative integer"));
  }
  if (typeof phone.quoteOnly !== "boolean") {
    issues.push(createIssue(["quoteOnly"], "quoteOnly must be a boolean"));
  }

  if (issues.length > 0) {
    return { success: false, error: { issues } };
  }

  return { success: true, data: phone };
});

const listPhonesQuerySchema = createSchema((input) => {
  const source = input && typeof input === "object" ? input : {};
  const issues = [];

  const pageResult = normalizePositiveInt(source.page, "page", { min: 1 });
  const pageSizeResult = normalizePositiveInt(source.pageSize, "pageSize", {
    min: 1,
    max: PHONE_PAGE_SIZE_MAX,
  });
  const minPriceResult = normalizePositiveInt(source.minPriceCents, "minPriceCents", { min: 0 });
  const maxPriceResult = normalizePositiveInt(source.maxPriceCents, "maxPriceCents", { min: 0 });

  [pageResult, pageSizeResult, minPriceResult, maxPriceResult].forEach((result) => {
    if (!result.ok) {
      issues.push(result.issue);
    }
  });

  const parsed = {
    q: normalizeOptionalText(source.q),
    brand: normalizeOptionalText(source.brand),
    minPriceCents: minPriceResult.ok ? minPriceResult.value : undefined,
    maxPriceCents: maxPriceResult.ok ? maxPriceResult.value : undefined,
    page: pageResult.ok && typeof pageResult.value === "number" ? pageResult.value : 1,
    pageSize: pageSizeResult.ok && typeof pageSizeResult.value === "number" ? pageSizeResult.value : PHONE_PAGE_SIZE_DEFAULT,
  };

  if (
    typeof parsed.minPriceCents === "number" &&
    typeof parsed.maxPriceCents === "number" &&
    parsed.minPriceCents > parsed.maxPriceCents
  ) {
    issues.push(createIssue(["minPriceCents"], "minPriceCents must be less than or equal to maxPriceCents"));
  }

  if (issues.length > 0) {
    return { success: false, error: { issues } };
  }

  return { success: true, data: parsed };
});

const phonesCollectionMetaSchema = createSchema((input) => {
  const source = input && typeof input === "object" ? input : {};
  const meta = {
    page: Number(source.page),
    pageSize: Number(source.pageSize),
    total: Number(source.total),
    totalPages: Number(source.totalPages),
    hasNextPage: Boolean(source.hasNextPage),
    hasPreviousPage: Boolean(source.hasPreviousPage),
    availableBrands: Array.isArray(source.availableBrands) ? source.availableBrands.filter((item) => typeof item === "string") : [],
  };

  if (
    !Number.isInteger(meta.page) ||
    !Number.isInteger(meta.pageSize) ||
    !Number.isInteger(meta.total) ||
    !Number.isInteger(meta.totalPages)
  ) {
    return { success: false, error: { issues: [createIssue(["meta"], "meta fields must be integers")] } };
  }

  return { success: true, data: meta };
});

const listPhonesResponseSchema = createSchema((input) => {
  const source = input && typeof input === "object" ? input : {};

  if (!Array.isArray(source.data)) {
    return { success: false, error: { issues: [createIssue(["data"], "data must be an array")] } };
  }

  const parsedData = [];
  for (const item of source.data) {
    const parsed = phoneSchema.safeParse(item);
    if (!parsed.success) {
      return parsed;
    }
    parsedData.push(parsed.data);
  }

  const parsedMeta = phonesCollectionMetaSchema.safeParse(source.meta);
  if (!parsedMeta.success) {
    return parsedMeta;
  }

  return {
    success: true,
    data: {
      data: parsedData,
      meta: parsedMeta.data,
    },
  };
});

const phoneDetailResponseSchema = createSchema((input) => {
  const source = input && typeof input === "object" ? input : {};
  const parsedPhone = phoneSchema.safeParse(source.data);

  if (!parsedPhone.success) {
    return parsedPhone;
  }

  return { success: true, data: { data: parsedPhone.data } };
});

const quoteRequestInputSchema = createSchema((input) => {
  const source = input && typeof input === "object" ? input : {};
  const quoteRequest = {
    name: typeof source.name === "string" ? source.name.trim() : "",
    email: typeof source.email === "string" ? source.email.trim() : "",
    phone: typeof source.phone === "string" ? source.phone.trim() : "",
    product: normalizeOptionalText(source.product),
    message: typeof source.message === "string" ? source.message.trim() : "",
    sourcePage: normalizeOptionalText(source.sourcePage),
  };

  const issues = [];

  if (!quoteRequest.name || quoteRequest.name.length < 3) {
    issues.push(createIssue(["name"], "name must have at least 3 characters"));
  }

  if (!quoteRequest.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(quoteRequest.email)) {
    issues.push(createIssue(["email"], "email must be valid"));
  }

  if (!quoteRequest.phone || quoteRequest.phone.length < 8) {
    issues.push(createIssue(["phone"], "phone must have at least 8 characters"));
  }

  if (!quoteRequest.message || quoteRequest.message.length < 10) {
    issues.push(createIssue(["message"], "message must have at least 10 characters"));
  }

  if (issues.length > 0) {
    return { success: false, error: { issues } };
  }

  return { success: true, data: quoteRequest };
});

function buildPhonesRoute(phoneId) {
  return phoneId ? `/api/v1/phones/${phoneId}` : "/api/v1/phones";
}

module.exports = {
  PHONE_PAGE_SIZE_DEFAULT,
  PHONE_PAGE_SIZE_MAX,
  buildPhonesRoute,
  listPhonesQuerySchema,
  listPhonesResponseSchema,
  phoneDetailResponseSchema,
  phoneSchema,
  phonesCollectionMetaSchema,
  quoteRequestInputSchema,
};
