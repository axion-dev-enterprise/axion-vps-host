import type { ListPhonesParams, ListPhonesResult, Phone, SyncPhonesResult } from "./phones.models";
import type { PhonesRepository } from "./phones.repository";
import { scrapeMarketplacePhones } from "./phones.sync";

export class PhonesService {
  constructor(
    private readonly repo: PhonesRepository,
    private readonly syncConfig: {
      siteUrl: string;
      searchTerms: string[];
    },
  ) {}

  list(params: ListPhonesParams): Promise<ListPhonesResult> {
    return this.repo.list(params);
  }

  getById(id: string): Promise<Phone | null> {
    return this.repo.getById(id);
  }

  async syncCatalog(): Promise<SyncPhonesResult> {
    const phones = await scrapeMarketplacePhones(this.syncConfig);
    const imported = await this.repo.replaceCatalog(phones);

    return {
      imported,
      source: "gsmarena-scraper",
      terms: this.syncConfig.searchTerms,
    };
  }
}

