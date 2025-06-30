import { auth } from "@/auth";
import { UserBaseInfoForm } from "./form";
import { UserRepository } from "@/repositories";

export default async function PersonalPage() {
  const userId = (await auth())?.user!.id!;
  const user = await UserRepository.getUserById({ where: { id: userId } });
  return <UserBaseInfoForm user={user!} />;
}
