import { MostSoldCarousel } from "@/components/home/MostSoldCarousel";
import { getPhonesCatalog } from "@/lib/api/catalog";

export async function MostSoldSection() {
  const result = await getPhonesCatalog({ pageSize: 8 });

  return <MostSoldCarousel products={result.data} />;
}
