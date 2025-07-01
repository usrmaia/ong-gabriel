import { auth } from "@/auth";
import { UserBaseInfoForm } from "./form";
import { getUserById } from "@/services";

export default async function PersonalPage() {
  const userId = (await auth())?.user.id!;
  const result = await getUserById(userId);
  return <UserBaseInfoForm user={result.data!} />;
}
