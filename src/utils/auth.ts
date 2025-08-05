import { User } from "@prisma/client";

import { auth } from "@/auth";
import { getUserById } from "@/services";

export const getUserIdAuthenticated = async (): Promise<string> => {
  const userId = (await auth())?.user.id;
  if (!userId) throw new Error("User not authenticated");
  return userId;
};

export const getUserAuthenticated = async (): Promise<
  Pick<User, "id" | "name" | "role" | "email">
> => {
  const userId = (await auth())?.user.id;
  if (!userId) throw new Error("User not authenticated");

  const userResult = await getUserById(userId, {
    select: { id: true, name: true, role: true, email: true },
  });
  if (!userResult.success || !userResult.data)
    throw new Error("User not found");

  return userResult.data;
};
