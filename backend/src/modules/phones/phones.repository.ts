import type { ListPhonesParams, ListPhonesResult, Phone } from "./phones.models";

export interface PhonesRepository {
  list(params: ListPhonesParams): Promise<ListPhonesResult>;
  getById(id: string): Promise<Phone | null>;
  replaceCatalog(phones: Phone[]): Promise<number>;
}

function getPhonePriceCents(phone: Phone) {
  return phone.priceCents ?? 0;
}

const seedPhones: Phone[] = [
  {
    id: "MLB-SAMSUNG-GALAXY-S24-256",
    brand: "Samsung",
    model: "Galaxy S24",
    storageGb: 256,
    priceCents: 499990,
    quoteOnly: true,
    shortDescription: "Tela compacta, IA nativa e bateria para rotina intensa.",
  },
  {
    id: "MLB-APPLE-IPHONE-15-128",
    brand: "Apple",
    model: "iPhone 15",
    storageGb: 128,
    priceCents: 549990,
    quoteOnly: true,
    shortDescription: "Desempenho consistente para foto, video e apps do dia a dia.",
  },
  {
    id: "MLB-MOTOROLA-EDGE-50-256",
    brand: "Motorola",
    model: "Edge 50",
    storageGb: 256,
    priceCents: 279990,
    quoteOnly: true,
    shortDescription: "Tela fluida, boa autonomia e custo mais leve na entrada.",
  },
];

export class InMemoryPhonesRepository implements PhonesRepository {
  private phones: Phone[];

  constructor(initialData: Phone[] = seedPhones) {
    this.phones = initialData;
  }

  async list(params: ListPhonesParams): Promise<ListPhonesResult> {
    const normalizedQ = params.q?.trim().toLowerCase();
    const normalizedBrand = params.brand?.trim().toLowerCase();
    const availableBrands = [...new Set(this.phones.map((phone) => phone.brand))].sort((left, right) =>
      left.localeCompare(right),
    );

    const filtered = this.phones.filter((phone) => {
      if (normalizedBrand && phone.brand.toLowerCase() !== normalizedBrand) {
        return false;
      }

      if (typeof params.minPriceCents === "number" && getPhonePriceCents(phone) < params.minPriceCents) {
        return false;
      }

      if (typeof params.maxPriceCents === "number" && getPhonePriceCents(phone) > params.maxPriceCents) {
        return false;
      }

      if (normalizedQ) {
        const haystack = `${phone.brand} ${phone.model} ${phone.storageGb}`.toLowerCase();
        return haystack.includes(normalizedQ);
      }

      return true;
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
    const found = this.phones.find((phone) => phone.id === id);
    return found ?? null;
  }

  async replaceCatalog(phones: Phone[]): Promise<number> {
    this.phones = [...phones];
    return this.phones.length;
  }
}
