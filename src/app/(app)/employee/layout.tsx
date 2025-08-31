import { getUserAuthenticated } from "@/utils/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserAuthenticated();

  if (!user.role.includes("EMPLOYEE")) return <div>Unauthorized</div>;
  return <>{children}</>;
}
