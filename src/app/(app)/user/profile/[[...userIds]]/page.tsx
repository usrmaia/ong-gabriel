import { redirect } from "next/navigation";

import { BackNavigationHeader } from "@/components/ui";
import { ProfileForm } from "./form";
import { getUserById } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ userIds?: string[] }>;
}) {
  const { userIds } = await params;
  const routeUserId = userIds?.[0];

  const authUser = await getUserAuthenticated();
  const isAdmin = authUser.role.includes("ADMIN");

  if (routeUserId && !isAdmin) redirect("/user/profile");

  const targetUserId = routeUserId ?? authUser.id;
  const isOwnProfile = String(targetUserId) === String(authUser.id);

  const userResult = await getUserById(targetUserId, {
    select: {
      date_of_birth: true,
      full_name: true,
      id: true,
      name: true,
      phone: true,
      role: true,
      email: true,
      image: true,
    },
  });
  if (!userResult.success || !userResult.data) redirect("/user/profile/failed");

  return (
    <>
      <BackNavigationHeader title="Perfil" />
      <ProfileForm
        user={userResult.data}
        isOwnProfile={isOwnProfile}
        isAdmin={isAdmin}
      />
    </>
  );
}
