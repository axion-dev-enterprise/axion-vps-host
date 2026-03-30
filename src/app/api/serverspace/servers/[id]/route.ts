import { getServer } from "@/lib/serverspace";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const server = await getServer(id);
  return Response.json({ data: server });
}
