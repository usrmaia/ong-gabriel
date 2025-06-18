import { z } from "zod/v4";

export const UserBaseInfoSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório."),
  full_name: z.string().min(1, "Nome completo é obrigatório."),
  date_of_birth: z
    .date()
    .min(
      new Date().setFullYear(new Date().getFullYear() - 140),
      "Data de nascimento inválida.",
    ),
  phone: z
    .string()
    .regex(/^\([1-9]{2}\) 9[7-9]{1}[0-9]{3}-[0-9]{4}$/, "Telefone inválido."),
});

export type UserBaseInfo = z.infer<typeof UserBaseInfoSchema>;
