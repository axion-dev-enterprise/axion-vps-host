import { load } from "cheerio";

import seedPhones from "./phones.seed.json";
import type { Phone } from "./phones.models";

const DEFAULT_STORAGE_GB = 128;
const BRAND_PAGE_LIMIT = 3;
const PER_BRAND_LIMIT = 30;
const MIN_LIVE_PRODUCTS = 100;
const MAX_IMPORTED_PRODUCTS = 180;
const STORAGE_REGEX = /(\d{2,4})\s?gb|\b(\d(?:[.,]\d+)?)\s?tb\b/i;
const EXCLUDED_MODEL_REGEX = /(ipad|tablet|tab\b|watch|band|buds|vision|book|pad\b|tv\b)/i;
const GSM_ARENA_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36";

type SyncConfig = {
  siteUrl: string;
  searchTerms: string[];
};

type MakerEntry = {
  brand: string;
  href: string;
};

function normalizeText(value: string) {
  return value.toLowerCase().replace(/\d+/g, "").replace(/\s+/g, " ").trim();
}

function toSlugId(href: string) {
  const id = href.match(/-(\d+)\.php$/)?.[1];
  return id ? `gsmarena-${id}` : `gsmarena-${href.replace(/[^a-z0-9]+/gi, "-").toLowerCase()}`;
}

function extractStorageGb(name: string) {
  const match = name.match(STORAGE_REGEX);
  if (!match) {
    return DEFAULT_STORAGE_GB;
  }

  if (match[1]) {
    return Number.parseInt(match[1], 10);
  }

  if (!match[2]) {
    return DEFAULT_STORAGE_GB;
  }

  return Math.round(Number.parseFloat(match[2].replace(",", ".")) * 1024);
}

function cleanModel(name: string, brand: string) {
  return name.replace(new RegExp(`^${brand}\\s+`, "i"), "").replace(/\s{2,}/g, " ").trim();
}

function buildShortDescription(name: string) {
  return `Catálogo atualizado com ${name}. Solicite disponibilidade e atendimento comercial.`;
}

async function fetchHtml(url: string) {
  const response = await fetch(url, {
    headers: {
      "accept-language": "en-US,en;q=0.9,pt-BR;q=0.8",
      "user-agent": GSM_ARENA_USER_AGENT,
    },
  });

  if (!response.ok) {
    throw new Error(`Catalog request failed: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

async function loadMakerEntries(siteUrl: string) {
  const html = await fetchHtml(`${siteUrl}/makers.php3`);
  const $ = load(html);
  const entries = new Map<string, MakerEntry>();

  $("a[href$='.php']").each((_index, element) => {
    const href = $(element).attr("href")?.trim();
    const rawText = $(element).text().trim();

    if (!href || !/-phones-\d+\.php$/i.test(href) || !rawText) {
      return;
    }

    const brand = rawText.replace(/\d.*$/, "").trim();
    if (!brand) {
      return;
    }

    entries.set(brand.toLowerCase(), { brand, href });
  });

  return [...entries.values()];
}

function selectMakers(makers: MakerEntry[], searchTerms: string[]) {
  const fallbackTerms = ["apple", "samsung", "xiaomi", "motorola", "google", "realme"];
  const requested = (searchTerms.length ? searchTerms : fallbackTerms).map((term) => normalizeText(term));
  const selected = new Map<string, MakerEntry>();

  for (const term of requested) {
    const match = makers.find((maker) => normalizeText(maker.brand).includes(term));
    if (match) {
      selected.set(match.brand.toLowerCase(), match);
    }
  }

  return [...selected.values()];
}

function getPageHref(baseHref: string, page: number) {
  if (page === 1) {
    return baseHref;
  }

  return baseHref.replace(/(\d+)\.php$/i, `f-$1-0-p${page}.php`);
}

function parseBrandPhones(siteUrl: string, brand: string, html: string) {
  const $ = load(html);
  const phones: Phone[] = [];

  $("div.makers ul li").each((_index, element) => {
    if (phones.length >= PER_BRAND_LIMIT) {
      return false;
    }

    const anchor = $(element).find("a").first();
    const href = anchor.attr("href")?.trim();
    const name = $(element).find("span").text().trim();
    const imageUrl = $(element).find("img").attr("src")?.trim();

    if (!href || !name || !imageUrl || EXCLUDED_MODEL_REGEX.test(name)) {
      return;
    }

    phones.push({
      id: toSlugId(href),
      brand,
      model: cleanModel(name, brand) || name,
      storageGb: extractStorageGb(name),
      priceCents: 0,
      quoteOnly: true,
      imageUrl: imageUrl.startsWith("http") ? imageUrl : new URL(imageUrl, siteUrl).toString(),
      shortDescription: buildShortDescription(name),
    });
  });

  return phones;
}

function getSeedPhones() {
  return (seedPhones as Phone[]).slice(0, MAX_IMPORTED_PRODUCTS);
}

export async function scrapeMarketplacePhones(config: SyncConfig) {
  try {
    const makers = await loadMakerEntries(config.siteUrl);
    const selectedMakers = selectMakers(makers, config.searchTerms);
    const deduped = new Map<string, Phone>();

    for (const maker of selectedMakers) {
      let brandCount = 0;

      for (let page = 1; page <= BRAND_PAGE_LIMIT; page += 1) {
        const html = await fetchHtml(`${config.siteUrl}/${getPageHref(maker.href, page)}`);
        const phones = parseBrandPhones(config.siteUrl, maker.brand, html);

        for (const phone of phones) {
          if (!deduped.has(phone.id) && brandCount < PER_BRAND_LIMIT) {
            deduped.set(phone.id, phone);
            brandCount += 1;
          }
        }

        if (brandCount >= PER_BRAND_LIMIT) {
          break;
        }
      }
    }

    const livePhones = [...deduped.values()].slice(0, MAX_IMPORTED_PRODUCTS);
    if (livePhones.length >= MIN_LIVE_PRODUCTS) {
      return livePhones;
    }

    return getSeedPhones();
  } catch {
    return getSeedPhones();
  }
}
