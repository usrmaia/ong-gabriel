import { z } from "zod/v4";

import { WhoLivesWith } from "@/generated/prisma";

export const UserBaseInfoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  full_name: z.string().min(1, "Nome completo é obrigatório."),
  date_of_birth: z
    .string()
    .min(1, "Data de nascimento é obrigatória.")
    .refine((value) => {
      const date = new Date(value);
      return (
        !isNaN(date.getTime()) &&
        new Date(date.getFullYear() - 140) < date &&
        date <= new Date()
      );
    }, "Data de nascimento inválida."),
  phone: z
    .string()
    .min(7, "Telefone é obrigatório.")
    .max(24, "Telefone inválido.")
    .transform((value) => {
      return value.replace(/\D/g, "");
    }),
});

export type UserBaseInfo = z.infer<typeof UserBaseInfoSchema>;

export const PatientFormAnamnesisSchema = z.object({
  whoLivesWith: z
    .array(z.enum(WhoLivesWith))
    .nonoptional()
    .refine((value) => value.includes("sozinho") && value.length === 1, {
      message: "Se 'sozinho' é selecionado, não pode haver outros valores!",
    }),
});
