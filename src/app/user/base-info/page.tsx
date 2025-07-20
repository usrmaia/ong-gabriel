import { auth } from "@/auth";
import { UserBaseInfoForm } from "./form";
import { getUserById } from "@/services";

export default async function UserBaseInfoPage() {
  const userId = (await auth())?.user.id!;
  const userResult = await getUserById(userId);

  if (!userResult.success || !userResult.data)
    return <div>{userResult.error?.errors}</div>;

  const user = userResult.data;
  return <UserBaseInfoForm user={user} />;
}
