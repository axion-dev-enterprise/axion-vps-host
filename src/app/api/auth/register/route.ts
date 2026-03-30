import { NextResponse } from "next/server";

import { registerUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { name?: string; email?: string; password?: string; company?: string };
    const user = await registerUser({
      name: body.name ?? "",
      email: body.email ?? "",
      password: body.password ?? "",
      company: body.company,
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Não foi possível criar a conta.";
    const status = message.includes("Já existe") || message.includes("pelo menos") || message.includes("Preencha") ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
