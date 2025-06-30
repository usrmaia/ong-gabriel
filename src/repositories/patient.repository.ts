import { FormAnamnesis, Prisma } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export class PatientRepository {
  static async getPatientFormAnamnesis(filter: {
    where?: Prisma.FormAnamnesisWhereInput;
  }) {
    return prisma.formAnamnesis.findMany({ where: filter.where });
  }

  static async createPatientFormAnamnesis(
    data: Prisma.FormAnamnesisUncheckedCreateInput,
  ): Promise<FormAnamnesis> {
    return await prisma.formAnamnesis.create({ data });
  }
}
