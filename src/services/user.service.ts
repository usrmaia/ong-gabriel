import z from "zod/v4";

import { User } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { UserBaseInfo, UserBaseInfoSchema } from "@/schemas";
import { Result } from "@/types";

export const updateUserBaseInfo = async (
  userId: string,
  _data: UserBaseInfo,
): Promise<Result<User>> => {
  const { success, data, error } =
    await UserBaseInfoSchema.safeParseAsync(_data);
  if (!success) return { success: false, error: z.treeifyError(error) };

  const updatedUser = await prisma.user.update({
    data: {
      name: data.name,
      full_name: data.full_name,
      date_of_birth: data.date_of_birth,
      phone: data.phone,
      phoneVerified: null,
    },
    where: {
      id: userId,
    },
  });

  return { success: true, data: updatedUser };
};
