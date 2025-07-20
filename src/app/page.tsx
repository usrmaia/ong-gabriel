import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { getUserAuthenticated } from "@/utils/auth";

export default async function Home() {
  const session = await auth();

  if (!session) redirect("/auth/login");

  const user = await getUserAuthenticated();

  if (user.role.includes("EMPLOYEE")) redirect("/employee/home");
  redirect("/patient/form-anamnesis?redirectTo=/user/base-info");
}
