import AuthPage from "@/features/auth/page";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string; next?: string }>;
}) {
  const params = await searchParams;
  return <AuthPage searchParams={params} />;
}
