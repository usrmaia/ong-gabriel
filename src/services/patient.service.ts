import prisma from "@/lib/prisma";

import { FormAnamnesis, Prisma } from "@/generated/prisma";
import { PatientFormAnamnesisSchema } from "@/schemas";

export const getPatientFormAnamnesis = async (filter: {
  where: Prisma.FormAnamnesisWhereInput;
}) => {
  return prisma.formAnamnesis.findMany({
    where: filter.where,
  });
};

export const getPatientFormAnamnesisByUserId = async (filter: {
  userId: string;
}) => {
  return prisma.formAnamnesis.findMany({
    where: {
      userId: filter.userId,
    },
  });
};

export const createPatientFormAnamnesis = async (
  formAnamnesis: FormAnamnesis,
) => {
  const { success, error } =
    await PatientFormAnamnesisSchema.safeParseAsync(formAnamnesis);
  if (!success) throw new Error(error.message);

  try {
    return prisma.formAnamnesis.create({
      data: formAnamnesis,
    });
  } catch (error) {
    throw new Error("Erro ao cadastrar formulário de anamnese!");
  }
};
