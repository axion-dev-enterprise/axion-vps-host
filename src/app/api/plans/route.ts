import { readFile } from "node:fs/promises";
import path from "node:path";

export const dynamic = "force-dynamic";

export async function GET() {
  const filePath = path.join(process.cwd(), "data", "plans.json");

  try {
    const content = await readFile(filePath, "utf8");
    const plans = JSON.parse(content);
    return Response.json(plans);
  } catch (error) {
    console.error("Erro ao carregar data/plans.json:", error);
    return Response.json([], { status: 200 });
  }
}
