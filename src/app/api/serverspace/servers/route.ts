import { getPlanById } from "@/lib/vps-marketplace";
import { createServer } from "@/lib/serverspace";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    planId?: string;
    clientId?: string;
    location?: string;
    serverName?: string;
  };

  if (!body.planId || !body.clientId) {
    return Response.json({ error: "planId e clientId sao obrigatorios." }, { status: 400 });
  }

  const plan = await getPlanById(body.planId);
  if (!plan) {
    return Response.json({ error: "Plano nao encontrado." }, { status: 404 });
  }

  const server = await createServer({
    planId: plan.id,
    template: plan.serverspace_template,
    serverPlan: plan.serverspace_plan,
    clientId: body.clientId,
    location: body.location,
    serverName: body.serverName,
  });

  return Response.json({ data: server });
}
