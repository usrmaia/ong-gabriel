import prisma from "@/lib/prisma";
import { CreatePsych } from "@/schemas";
import { getUserAuthenticated } from "@/utils/auth";

export async function createPsychFromUser(data: CreatePsych) {
  const user = await getUserAuthenticated();

  if (user.role.includes("EMPLOYEE"))
    throw new Error("O usuário já é um psicologo");

  const existingCRP = await prisma.psych.count({
    where: { CRP: data.CRP, user: { role: { has: "EMPLOYEE" } } },
  });
  if (existingCRP > 0) throw new Error("Este CRP já está cadastrado");

  // Atualizar depois para getDocumentById -> createDocument
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

  const psycho = await prisma.psych.create({
    data: {
      userId: user.id,
      CRP: data.CRP,
      note: data.note,
      proofAddress: {},
      curriculum: {},
      street: data.street,
      number: data.number,
      complement: data.complement,
      district: data.district,
      city: data.city,
      state: data.state,
      zipCode: data.zipCode,
    },
    include: {
      proofAddress: true,
      curriculumVitae: true,
    },
  });

  return psycho;
}
