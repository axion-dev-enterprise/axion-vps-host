import { NextResponse } from "next/server";

import { authenticateUser, createSessionToken, getSessionCookie } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const user = await authenticateUser(body.email ?? "", body.password ?? "");

    if (!user) {
      return NextResponse.json({ error: "Email ou senha inválidos." }, { status: 401 });
    }

    const response = NextResponse.json({ user });
    response.cookies.set(getSessionCookie(createSessionToken(user)));
    return response;
  } catch {
    return NextResponse.json({ error: "Não foi possível realizar o login." }, { status: 500 });
  }
}
