import { can } from "@/permissions";
import { getUserAuthenticated } from "@/utils/auth";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserAuthenticated();
  if (!can(user, "view", "patientAttendance")) {
    return <div>Unauthorized</div>;
  }

  return <>{children}</>;
}
