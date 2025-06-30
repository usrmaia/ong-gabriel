import { Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export class UserRepository {
  static async getUserById(filter: { where: { id: string } }) {
    return prisma.user.findUnique({
      where: { id: filter.where.id },
    });
  }

  static async updateUserById(
    filter: { id: string },
    data: Prisma.UserUpdateInput,
  ) {
    return await prisma.user.update({ data, where: { id: filter.id } });
  }
}
