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
      const now = new Date();
      const minDate = new Date(now.getFullYear() - 140, 0, 1);

      const isValidDate = !isNaN(date.getTime());
      return isValidDate && date >= minDate && date <= now;
    }, "Data de nascimento inválida.")
    .transform((value) => new Date(value)),
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
    .transform<unknown, WhoLivesWith[]>((value) => {
      if (typeof value === "string") value = value.split(",");
      if (Array.isArray(value) && value.every((item) => item in WhoLivesWith)) {
        return value.map(
          (item: keyof typeof WhoLivesWith) => WhoLivesWith[item],
        );
      }
      return [];
    })
    .nonoptional()
    .refine((value) => !value.includes("sozinho") || value.length === 1, {
      message: "Se 'sozinho' é selecionado, não pode haver outros valores!",
    }),
  difficultiesBasic: z.string().nonempty("Selecione pelo menos uma opção."),
  emotionalState: z.string().nonempty("Selecione pelo menos uma opção."),
  difficultiesSleeping: z.string().nonempty("Selecione pelo menos uma opção."),
  difficultyEating: z.string().nonempty("Selecione pelo menos uma opção."),
});
