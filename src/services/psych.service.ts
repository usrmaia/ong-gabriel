import prisma from "@/lib/prisma";
import { getUserAuthenticated } from "@/utils/auth";

type CreatePsychData = Parameters<typeof prisma.psychologist.create>[0]["data"];

type RequiredFields =
  | "CRP"
  | "proofAddressId"
  | "curriculumVitaeId"
  | "street"
  | "number"
  | "district"
  | "city"
  | "state"
  | "zipCode";

type FixedPsychData = Omit<CreatePsychData, "userId"> & {
  [K in RequiredFields]-?: NonNullable<CreatePsychData[K]>;
};

export async function createPsychFromUser(data: FixedPsychData) {
  const user = await getUserAuthenticated();
  if (!user) throw new Error("Usuário não autenticado");

  const existing = await prisma.psychologist.findUnique({
    where: { userId: user.id },
  });
  if (existing) throw new Error("O usuário já é um psicólogo");

  const proofAddress = await prisma.document.findUnique({
    where: { id: data.proofAddressId },
  });
  if (!proofAddress || proofAddress.userId !== user.id) {
    throw new Error(
      "Você não tem permissão para usar este comprovante de endereço",
    );
  }

  const curriculum = await prisma.document.findUnique({
    where: { id: data.curriculumVitaeId },
  });
  if (!curriculum || curriculum.userId !== user.id) {
    throw new Error("Você não tem permissão para usar este currículo");
  }

  const psychologist = await prisma.psychologist.create({
    data: {
      userId: user.id,
      CRP: data.CRP,
      note: data.note,
      proofAddressId: data.proofAddressId,
      curriculumVitaeId: data.curriculumVitaeId,
      street: data.street,
      number: data.number,
      complement: data.complement,
      district: data.district,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
      specialty: data.specialty,
    },
  });

  return await prisma.psychologist.findUnique({
    where: { id: psychologist.id },
  });
}
