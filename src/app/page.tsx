import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { Role } from "@/generated/prisma";

export default async function Home() {
  const userRole = (await auth())?.user?.role as Role[] | undefined;

  if (!userRole) redirect("/auth/login");

  if (userRole.includes("EMPLOYEE")) redirect("/employee/home");
  redirect("/patient/form-anamnesis");
}
