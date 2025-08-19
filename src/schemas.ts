import {
  DifficultiesBasic,
  DifficultiesEating,
  DifficultiesSleeping,
  WhoLivesWith,
} from "@prisma/client";
import { z } from "zod/v4";

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

export type UserBaseInfo = z.input<typeof UserBaseInfoSchema>;

const PatientFormAnamnesisSalarySchema = z
  .union([z.string(), z.number(), z.bigint()])
  .transform<bigint>((value) => {
    if (typeof value === "string") {
      const cleanValue = value.trim().replace(",", ".");
      try {
        const floatValue = parseFloat(cleanValue);
        return BigInt(Math.round(floatValue * 100));
      } catch {
        return BigInt(-1);
      }
    }
    return BigInt(value);
  });

export const WhoLivesWithSchema = z
  .array(z.enum(WhoLivesWith))
  .transform((value) =>
    value.map((item) => {
      switch (item) {
        case "amigos":
          return "Amigos";
        case "familia":
          return "Família";
        case "outras_pessoas":
          return "Outras pessoas";
        case "sozinho":
          return "Sozinho";
      }
    }),
  );

export const DifficultiesBasicSchema = z
  .enum(DifficultiesBasic)
  .transform((value) => {
    switch (value) {
      case "sim":
        return "Sim";
      case "as_vezes":
        return "Às vezes";
      case "nao":
        return "Não";
    }
  });

export const DifficultiesSleepingSchema = z
  .enum(DifficultiesSleeping)
  .transform((value) => {
    switch (value) {
      case "sim":
        return "Sim";
      case "as_vezes":
        return "Às vezes";
      case "nao":
        return "Não";
    }
  });

export const DifficultiesEatingSchema = z
  .enum(DifficultiesEating)
  .transform((value) => {
    switch (value) {
      case "sim":
        return "Sim";
      case "as_vezes":
        return "Às vezes";
      case "nao":
        return "Não";
    }
  });

export const PatientFormAnamnesisSchema = z.object({
  whoLivesWith: z
    .transform<unknown, WhoLivesWith[]>((value) => {
      if (typeof value === "string")
        return value.split(",").map((item) => item.trim() as WhoLivesWith);
      return value as WhoLivesWith[];
    })
    .refine((value) => value.length !== 0, {
      message: "Selecione pelo menos uma opção.",
    })
    .refine((value) => value.every((item) => item in WhoLivesWith), {
      message: "Opção inválida selecionada.",
    })
    .refine((value) => !value.includes("sozinho") || value.length === 1, {
      message: "Se 'sozinho' é selecionado, não pode haver outros valores.",
    }),
  monthlyIncomeCents: PatientFormAnamnesisSalarySchema.refine(
    (value) => !!value && value >= 0,
    {
      message: "Renda mensal é obrigatória.",
    },
  ),
  monthlyFamilyIncomeCents: PatientFormAnamnesisSalarySchema.refine(
    (value) => !!value && value >= 0,
    {
      message: "Renda familiar mensal é obrigatória.",
    },
  ),
  difficultiesBasic: z.any().nonoptional("Selecione pelo menos uma opção."),
  emotionalState: z.any().nonoptional("Selecione pelo menos uma opção."),
  difficultiesSleeping: z.any().nonoptional("Selecione pelo menos uma opção."),
  difficultyEating: z.any().nonoptional("Selecione pelo menos uma opção."),
});

const PatientAttendanceDateAtSchema = z
  .union([z.string(), z.date()])
  .optional()
  .refine((value) => {
    if (!value) return true;

    const date = new Date(value);
    const rangeDay = 30;

    const isValidDate = !isNaN(date.getTime());
    const minDate = new Date();
    minDate.setDate(minDate.getDate() - rangeDay);
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + rangeDay);
    return isValidDate && minDate <= date && date <= maxDate;
  }, "Data do atendimento inválida. Deve estar entre 30 dias atrás e 30 dias à frente.")
  .transform((value) => (value ? new Date(value) : undefined));

const PatientAttendanceDurationMinutesSchema = z
  .number()
  .optional()
  .refine((value) => !value || value >= 0, {
    message: "Duração deve ser um número positivo.",
  });

export const CreatePatientAttendanceSchema = z.object({
  patientId: z.string().min(1, "ID do paciente é obrigatório."),
  professionalId: z.string().min(1, "ID do profissional é obrigatório."),
  durationMinutes: PatientAttendanceDurationMinutesSchema,
  dateAt: PatientAttendanceDateAtSchema,
});

export const UpdatePatientAttendanceSchema = z.object({
  dateAt: PatientAttendanceDateAtSchema,
  durationMinutes: PatientAttendanceDurationMinutesSchema,
});
