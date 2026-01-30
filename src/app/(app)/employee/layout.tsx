import { getUserAuthenticated } from "@/utils/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserAuthenticated();

  if (!user.role.includes("EMPLOYEE"))
    return (
      <p className="text-center text-error">
        Você não tem permissão para acessar esta página.
      </p>
    );
  return <>{children}</>;
}
