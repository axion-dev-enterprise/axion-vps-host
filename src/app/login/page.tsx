import { AuthCard } from "@/components/auth/AuthCard";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const params = await searchParams;
  return <AuthCard mode="login" redirectTarget={params.next || "/dashboard"} />;
}
