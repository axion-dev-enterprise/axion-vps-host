import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

import { scrapeMarketplacePhones } from "../modules/phones/phones.sync";

async function main() {
  const phones = await scrapeMarketplacePhones({
    siteUrl: "https://www.gsmarena.com",
    searchTerms: ["apple", "samsung", "xiaomi", "motorola", "google", "realme"],
  });
  const filePath = resolve(process.cwd(), "src/modules/phones/phones.seed.json");
  mkdirSync(dirname(filePath), { recursive: true });
  writeFileSync(filePath, JSON.stringify(phones, null, 2));
  process.stdout.write(`Seed written to ${filePath} with ${phones.length} products\n`);
}

main().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
  process.exitCode = 1;
});
