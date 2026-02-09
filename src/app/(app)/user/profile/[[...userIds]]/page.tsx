import { redirect } from "next/navigation";

import { BackNavigationHeader } from "@/components/ui";
import { getUserById } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

import { ProfileForm } from "./form";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userIds?: string[] }>;
}) {
  const { userIds } = await params;
  const routeUserId = userIds?.[0];

  const authUser = await getUserAuthenticated();
  const isAdmin = authUser.role.includes("ADMIN");

  
  if (routeUserId && !isAdmin) {
    redirect("/user/profile");
  }

  const targetUserId = routeUserId ?? authUser.id;
  const isOwnProfile = String(targetUserId) === String(authUser.id);

  const userResult = await getUserById(targetUserId);
  if (!userResult.success || !userResult.data) {
    redirect("/user/profile/failed");
  }

  return (
    <>
      <BackNavigationHeader title="Perfil" href="/employee/home" />
      <ProfileForm
        user={userResult.data}
        isOwnProfile={isOwnProfile}
        isAdmin={isAdmin}
      />
    </>
  );
}
