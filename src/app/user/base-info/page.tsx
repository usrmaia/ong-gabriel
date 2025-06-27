import { auth } from "@/auth";
import { UserBaseInfoForm } from "./form";
import { getUserById } from "@/services";

export default async function PersonalPage() {
  const userId = (await auth())?.user!.id!;
  const user = await getUserById({ userId });
  return <UserBaseInfoForm user={user!} />;
}
