import { login } from "@/lib/auth";
import { Result } from "@/types";

export type UserLogin = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export async function onSubmit(
  redirectTo: string | null,
  prev: Result<UserLogin>,
  formData: FormData,
): Promise<Result<UserLogin>> {
  const formDataObject = Object.fromEntries(
    formData.entries(),
  ) as unknown as UserLogin;

  await login("Credentials", redirectTo, formData);

  return {
    success: true,
    data: formDataObject,
  };
}
