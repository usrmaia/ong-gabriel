import prisma from "@/lib/prisma"

export async function runCleanup() {
  const now = new Date()

  console.log("[CLEANUP] Iniciando job de limpeza:", now.toISOString())

  // Remove os tokens que já expiraram
  const deletedTokens = await prisma.userToken.deleteMany({
    where: {
      expiresAt: { lt: now },
    },
  })

  // Remove disponibilidades passadas que não tiveram atendimento
  const deletedAvailabilities =
    await prisma.availabilityAttendance.deleteMany({
      where: {
        startAt: { lt: now },
        attendance: null,
      },
    })

  // Remove documentos antigos que não foram referenciados pelo Psych
  const oneDayAgo = new Date()
  oneDayAgo.setDate(oneDayAgo.getDate() - 1)

  const deletedDocuments = await prisma.document.deleteMany({
    where: {
      createdAt: { lt: oneDayAgo },
      PsychProofAddress: null,
      PsychCurriculumVitae: null,
    },
  })

  console.log("[CLEANUP] Finalizado:", {
    tokens: deletedTokens.count,
    availabilities: deletedAvailabilities.count,
    documents: deletedDocuments.count,
  })
}