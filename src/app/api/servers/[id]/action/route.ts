import { runServerAction, type ServerSpaceAction } from "@/lib/serverspace";

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const body = (await request.json().catch(() => ({}))) as { action?: ServerSpaceAction };

  if (!body.action || !["start", "stop", "restart"].includes(body.action)) {
    return Response.json({ error: "Acao invalida. Use start, stop ou restart." }, { status: 400 });
  }

  const result = await runServerAction(id, body.action);
  return Response.json({ data: result, via: "serverspace" });
}
