import { prisma } from "../../lib/prisma";
import type { ListPhonesParams, ListPhonesResult, Phone } from "./phones.models";
import type { PhonesRepository } from "./phones.repository";

export class PrismaPhonesRepository implements PhonesRepository {
  private getPhonePriceCents(phone: Phone) {
    return phone.priceCents ?? 0;
  }

  private normalizeRows(rows: Array<{
    id: string;
    brand: string;
    model: string;
    storageGb: number;
    priceCents: number;
    quoteOnly: boolean;
    imageUrl: string | null;
    shortDescription: string | null;
  }>): Phone[] {
    return rows.map((row) => ({
      id: row.id,
      brand: row.brand,
      model: row.model,
      storageGb: row.storageGb,
      priceCents: row.priceCents,
      quoteOnly: row.quoteOnly,
      imageUrl: row.imageUrl ?? undefined,
      shortDescription: row.shortDescription ?? undefined,
    }));
  }

  async list(params: ListPhonesParams): Promise<ListPhonesResult> {
    const rows = await prisma.phone.findMany({
      orderBy: [{ importedAt: "desc" }, { brand: "asc" }, { model: "asc" }],
    });
    const phones = this.normalizeRows(rows);
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
    const found = await prisma.phone.findUnique({
      where: { id },
    });

    if (!found) return null;

    return {
      id: found.id,
      brand: found.brand,
      model: found.model,
      storageGb: found.storageGb,
      priceCents: found.priceCents,
      quoteOnly: found.quoteOnly,
      imageUrl: found.imageUrl ?? undefined,
      shortDescription: found.shortDescription ?? undefined,
    };
  }

  async replaceCatalog(phones: Phone[]): Promise<number> {
    await prisma.$transaction([
      prisma.phone.deleteMany(),
      prisma.phone.createMany({
        data: phones.map((phone) => ({
          id: phone.id,
          brand: phone.brand,
          model: phone.model,
          storageGb: phone.storageGb,
          priceCents: this.getPhonePriceCents(phone),
          quoteOnly: phone.quoteOnly,
          imageUrl: phone.imageUrl,
          shortDescription: phone.shortDescription,
          source: "mercadolivre",
          importedAt: new Date(),
        })),
      }),
    ]);

    return phones.length;
  }
}
