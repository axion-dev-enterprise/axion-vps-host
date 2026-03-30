import { cookies } from "next/headers";

import { DashboardOverview } from "@/components/dashboard/DashboardOverview";
import { AUTH_COOKIE_NAME, getUserFromToken } from "@/lib/auth";

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const user = await getUserFromToken(cookieStore.get(AUTH_COOKIE_NAME)?.value);

  if (!user) {
    return null;
  }

  return <DashboardOverview user={user} />;
}
