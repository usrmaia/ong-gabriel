import { auth } from "@/auth";
import { PersonalForm } from "./PersonalForm";

export default async function PersonalPage() {
  const user = (await auth())?.user!;
  return <PersonalForm user={user} />;
}
