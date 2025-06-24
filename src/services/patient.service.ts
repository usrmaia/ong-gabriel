import { FormAnamnesis, Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";
import { PatientFormAnamnesisSchema } from "@/schemas";
import { Result } from "@/types";

export const getPatientFormAnamnesis = async (filter: {
  where?: Prisma.FormAnamnesisWhereInput;
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
): Promise<Result<FormAnamnesis>> => {
  const { success, error } =
    await PatientFormAnamnesisSchema.safeParseAsync(formAnamnesis);
  if (!success) return { success: false, error: error.message };

  const createdFormAnamnesis = await prisma.formAnamnesis.create({
    data: formAnamnesis,
  });
  return { success: true, data: createdFormAnamnesis };
};
