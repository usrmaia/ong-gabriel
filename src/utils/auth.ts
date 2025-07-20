import { auth } from "@/auth";
import { User } from "@/generated/prisma";
import { getUserById } from "@/services";

export const getUserAuthenticated = async (): Promise<User> => {
  const userId = (await auth())?.user.id;
  if (!userId) throw new Error("User not authenticated");

  const userResult = await getUserById(userId);
  if (!userResult.success || !userResult.data)
    throw new Error("User not found");

  return userResult.data;
};
