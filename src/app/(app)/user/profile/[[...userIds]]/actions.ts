"use server";

import { Role } from "@prisma/client";

import { addRoleToUser, deleteRoleToUser } from "@/services";
import { updateUserBaseInfo } from "@/services";
import { getUserAuthenticated } from "@/utils/auth";
import { Result } from "@/types";
import { UserBaseInfo } from "@/schemas";

export async function saveBaseInfoAction(
  initialState: Result<UserBaseInfo>,
  formData: FormData,
): Promise<Result<UserBaseInfo>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as UserBaseInfo;

  const updatedUserResult = await updateUserBaseInfo(formDataObject);
  if (!updatedUserResult.success) {
    return {
      success: false,
      data: formDataObject,
      error: updatedUserResult.error,
      code: updatedUserResult.code,
    };
  }

  return {
    success: true,
    data: formDataObject,
    code: 200,
  };
}

export async function addRoleAction(
  userId: string,
  role: Role,
): Promise<Result<unknown>> {
  const authUser = await getUserAuthenticated();
  const isAdmin = authUser.role.includes("ADMIN");

  if (!isAdmin) {
    return {
      success: false,
      error: { errors: ["Acesso negado!"] },
      code: 403,
    };
  }

  const result = await addRoleToUser(userId, role);
  if (!result.success) return result;
  return { success: true, data: result.data, code: 200 };
}

export async function deleteRoleAction(
  userId: string,
  role: Role,
): Promise<Result<unknown>> {
  const authUser = await getUserAuthenticated();
  const isAdmin = authUser.role.includes("ADMIN");

  if (!isAdmin) {
    return {
      success: false,
      error: { errors: ["Acesso negado!"] },
      code: 403,
    };
  }

  const result = await deleteRoleToUser(userId, role);
  if (!result.success) return result;
  return { success: true, data: result.data, code: 200 };
}
