import { PrismaClient, Specialty } from "@prisma/client";

const prisma = new PrismaClient();

interface PsychInput {
  userId: string;
  CRP: string;
  note?: string;

  proofAddressId: string;
  curriculumVitaeId: string;

  street: string;
  number: string;
  complement?: string;
  district: string;
  city: string;
  state: string;
  zipCode: string;

  specialty: Specialty;
}

export async function createPsychFromUser(data: PsychInput) {
  const user = await prisma.user.findUnique({
    where: { id: data.userId },
    include: { Psychologist: true },
  });
  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  if (user.Psychologist) {
    throw new Error("O usuário já é um psicólogo");
  }

  const proofAddress = await prisma.document.findUnique({
    where: { id: data.proofAddressId },
  });
  if (!proofAddress) {
    throw new Error("Comprovante de endereço não encontrado");
  }
  if (proofAddress.userId !== data.userId) {
    throw new Error(
      "Você não tem permissão para usar este comprovante de endereço",
    );
  }

  const curriculum = await prisma.document.findUnique({
    where: { id: data.curriculumVitaeId },
  });
  if (!curriculum) {
    throw new Error("Currículo não encontrado");
  }
  if (curriculum.userId !== data.userId) {
    throw new Error("O usuário não tem permissão para usar este currículo");
  }

  const psychologist = await prisma.psychologist.create({
    data: {
      userId: data.userId,
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

  return psychologist;
}
