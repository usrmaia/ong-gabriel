import prisma from "@/lib/prisma";
import { UserBaseInfo, UserBaseInfoSchema } from "@/schemas";

export const updateUserBaseInfo = async (
  userId: string,
  _data: UserBaseInfo,
) => {
  const { success, data, error } =
    await UserBaseInfoSchema.safeParseAsync(_data);
  if (!success) throw new Error(error.message);

  return prisma.user.update({
    data: {
      name: data.name,
      full_name: data.full_name,
      date_of_birth: data.date_of_birth,
      phone: data.phone,
      phoneVerifiedAt: null,
    },
    where: {
      id: userId,
    },
  });
};
