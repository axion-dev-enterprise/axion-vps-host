import "dotenv/config";

import { PhonesService } from "../modules/phones/phones.service";
import { SqlitePhonesRepository } from "../modules/phones/sqlite.repository";

async function main() {
  const service = new PhonesService(new SqlitePhonesRepository(), {
    siteUrl: process.env.CATALOG_SITE_URL ?? "https://www.gsmarena.com",
    searchTerms: (process.env.CATALOG_SEARCH_TERMS ??
      "apple,samsung,xiaomi,motorola,google,realme")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean),
  });
  const result = await service.syncCatalog();
  process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
}

main()
  .catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
    process.exitCode = 1;
  });
