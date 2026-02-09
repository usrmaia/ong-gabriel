"use server";

import { Role } from "@prisma/client";

import { UserBaseInfo } from "@/schemas";
import {
  addRoleToUser,
  deleteRoleToUser,
  updateUserBaseInfo,
} from "@/services";
import { Result } from "@/types";
import { getUserAuthenticated } from "@/utils/auth";
import { revalidatePath } from "next/cache";

export async function saveBaseInfoAction(
  prev: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as UserBaseInfo;

  const updatedUserResult = await updateUserBaseInfo(formDataObject);
  return { ...updatedUserResult, data: formDataObject };
}

export type RoleAction = {
  action: "add" | "delete";
  userId: string;
  role: Role;
};

export async function roleAction(
  prev: Result<unknown>,
  formData: FormData,
): Promise<Result<unknown>> {
  const authUser = await getUserAuthenticated();
  const isAdmin = authUser.role.includes("ADMIN");

  if (!isAdmin)
    return {
      success: false,
      error: { errors: ["Acesso negado!"] },
      code: 403,
    };

  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as RoleAction;
  const { action, userId, role } = formDataObject;

  const result =
    action === "add"
      ? await addRoleToUser(userId, role)
      : await deleteRoleToUser(userId, role);

  revalidatePath("/user/profile");
  return result;
}
