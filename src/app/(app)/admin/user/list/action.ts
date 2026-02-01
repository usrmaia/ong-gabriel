"use server";

import { Role, User } from "@prisma/client";

import { getUsers } from "@/services";
import { Result } from "@/types";

type UserListResult = Result<{ users: User[]; filters: any }>;

export async function onSubmit(
  prev: UserListResult,
  formData: FormData,
): Promise<UserListResult> {
  const formDataObject = Object.fromEntries(formData.entries()) as unknown as {
    query?: string;
    role?: Role;
  };
  const { query, role } = formDataObject;

  const usersResult = await getUsers({
    where: {
      AND: [
        query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  full_name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  email: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {},
        role
          ? {
              role: { has: role },
            }
          : {},
      ],
    },
    orderBy: { name: "asc" },
  });

  return {
    success: usersResult.success,
    error: usersResult.error,
    data: { users: usersResult.data ?? [], filters: { query, role } },
  };
}
