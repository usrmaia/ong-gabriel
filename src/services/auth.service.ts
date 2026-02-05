import { z } from "zod/v4";

import logger from "@/config/logger";
import { sendEmail } from "@/infra";
import prisma from "@/lib/prisma";
import { Email, emailSchema, UserInput, UserInputSchema } from "@/schemas";
import { Result } from "@/types";
import { encrypt } from "@/utils";
import { createToken, deleteToken } from "./user.service";

export const initiateRegister = async (
  userInput: UserInput,
): Promise<Result<UserInput & { id: string }>> => {
  try {
    const validatedUserInput = await UserInputSchema.safeParseAsync(userInput);
    if (!validatedUserInput.success)
      return {
        success: false,
        error: z.treeifyError(validatedUserInput.error),
        code: 400,
      };

    // Usuário com email e role USER (usuários válido)
    const registeredUserCount = await prisma.user.count({
      where: { email: validatedUserInput.data.email, role: { has: "USER" } },
    });
    if (registeredUserCount > 0)
      return {
        success: false,
        error: { errors: ["Email já está em uso!"] },
        code: 409,
      };

    // Usuário com email (pode ter se registrado antes, mas não completou o cadastro)
    const userCountByEmail = await prisma.user.count({
      where: { email: validatedUserInput.data.email },
    });
    if (userCountByEmail > 0)
      return {
        success: false,
        error: {
          errors: [
            "Você já possui um cadastro! Por favor, verifique seu email para completar o cadastro.",
          ],
        },
        code: 409,
      };

    const passwordHash = encrypt(validatedUserInput.data.password);
    const newUser = await prisma.user.create({
      data: {
        name: validatedUserInput.data.name,
        email: validatedUserInput.data.email,
        passwordHash,
        role: [], // Inicialmente sem roles
      },
    });

    const userToken = await createToken({
      userId: newUser.id,
      type: "EMAIL_VERIFICATION",
    });
    if (!userToken.success)
      return {
        success: false,
        error: { errors: ["Erro ao criar token de confirmação!"] },
        code: 500,
      };

    sendEmail({
      to: newUser.email,
      template: "email-verification-registration-code",
      context: {
        userName: validatedUserInput.data.name,
        verificationCode: userToken.data!.token,
      },
    });

    return {
      success: true,
      data: {
        ...validatedUserInput.data,
        id: newUser.id,
        password: passwordHash,
      },
    };
  } catch (error) {
    logger.error("Erro ao registrar usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao registrar usuário!"] },
      code: 500,
    };
  }
};

export const resendConfirmationToken = async (
  userId: string,
): Promise<Result<null>> => {
  try {
    const user = await prisma.user.findUnique({
      select: { id: true, email: true, name: true },
      where: { id: userId },
    });

    if (!user)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };

    const userToken = await createToken({
      userId: user.id,
      type: "EMAIL_VERIFICATION",
    });
    if (!userToken.success)
      return {
        success: false,
        error: { errors: ["Erro ao criar token de confirmação!"] },
        code: 500,
      };

    sendEmail({
      to: user.email,
      template: "email-verification-registration-code",
      context: {
        userName: user.name || "",
        verificationCode: userToken.data!.token,
      },
    });

    return { success: true, data: null };
  } catch (error) {
    logger.error("Erro ao reenviar token de confirmação:", error);
    return {
      success: false,
      error: { errors: ["Erro ao reenviar token de confirmação!"] },
      code: 500,
    };
  }
};

export const confirmRegistration = async (
  userId: string,
  token: string,
): Promise<Result<null>> => {
  try {
    const userToken = await prisma.userToken.findFirst({
      where: {
        userId,
        token,
        type: "EMAIL_VERIFICATION",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!userToken)
      return {
        success: false,
        error: { errors: ["Token de confirmação inválido ou expirado!"] },
        code: 400,
      };

    await prisma.user.update({
      where: { id: userId },
      data: { emailVerified: new Date(), role: { push: "USER" } },
    });

    await deleteToken(userToken.id);

    return { success: true, data: null };
  } catch (error) {
    logger.error("Erro ao confirmar registro do usuário:", error);
    return {
      success: false,
      error: { errors: ["Erro ao confirmar registro do usuário!"] },
      code: 500,
    };
  }
};

export const initiatePasswordReset = async (
  email: Email,
): Promise<Result<null>> => {
  try {
    const validatedEmail = await emailSchema.safeParseAsync(email);
    if (!validatedEmail.success)
      return {
        success: false,
        error: z.treeifyError(validatedEmail.error),
        code: 400,
      };

    const user = await prisma.user.findUnique({
      select: { id: true, email: true, name: true, role: true },
      where: { email },
    });

    if (!user)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };

    const userToken = await createToken({
      userId: user.id,
      type: "RESET_PASSWORD",
    });
    if (!userToken.success)
      return {
        success: false,
        error: { errors: ["Erro ao criar token de redefinição!"] },
        code: 500,
      };

    sendEmail({
      to: user.email,
      template: "email-verification-reset-code",
      context: {
        userName: user.name || "",
        verificationCode: userToken.data!.token,
      },
    });

    return { success: true, code: 200 };
  } catch (error) {
    logger.error("Erro ao redefinir senha:", error);
    return {
      success: false,
      error: { errors: ["Erro ao redefinir senha!"] },
      code: 500,
    };
  }
};

export const confirmResetPassword = async (
  email: Email,
  token: string,
  password: string,
): Promise<Result<null>> => {
  try {
    const validatedEmail = await emailSchema.safeParseAsync(email);
    if (!validatedEmail.success)
      return {
        success: false,
        error: z.treeifyError(validatedEmail.error),
        code: 400,
      };

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };

    const userToken = await prisma.userToken.findFirst({
      where: {
        userId: user.id,
        token,
        type: "RESET_PASSWORD",
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });
    if (!userToken)
      return {
        success: false,
        error: { errors: ["Token de confirmação inválido ou expirado!"] },
        code: 400,
      };

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash: encrypt(password) },
    });

    await deleteToken(userToken.id);

    return { success: true };
  } catch (error) {
    logger.error("Erro ao confirmar reset de senha:", error);
    return {
      success: false,
      error: { errors: ["Erro ao confirmar reset de senha!"] },
      code: 500,
    };
  }
};
