import { UserBaseInfoForm } from "./form";
import { getUserById } from "@/services";
import { getUserIdAuthenticated } from "@/utils/auth";

export default async function UserBaseInfoPage() {
  const userId = await getUserIdAuthenticated();
  const userResult = await getUserById(userId);

  if (!userResult.success || !userResult.data)
    return <div>{userResult.error?.errors}</div>;

  const user = userResult.data;
  return <UserBaseInfoForm user={user} />;
}
