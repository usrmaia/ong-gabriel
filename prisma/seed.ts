import {
  DifficultiesBasic,
  DifficultiesEating,
  DifficultiesSleeping,
  EmotionalState,
  Prisma,
  PrismaClient,
  PsychStatus,
  Role,
  WhoLivesWith,
} from "@prisma/client";
import { fakerPT_BR as faker } from "@faker-js/faker";
import PDFDocument from "pdfkit";

const prisma = new PrismaClient();

async function main() {
  const isProduction = process.env.NODE_ENV === "production";
  if (isProduction) {
    console.log("🚫 Seed script não executado: ambiente de produção detectado");
    return;
  }

  console.log("🌱 Iniciando seed do banco de dados...");

  const protectedEmails = [
    "georgemaiaf@gmail.com",
    "fernandomafra1991@gmail.com",
    "feehscott@gmail.com",
    "apenasparatestes12345@gmail.com",
    "josivania0706@gmail.com",
  ];

  await Promise.all([
    prisma.session.deleteMany(),
    prisma.account.deleteMany(),
    prisma.authenticator.deleteMany(),
    prisma.user.deleteMany({
      where: { email: { notIn: protectedEmails } },
    }),
  ]);

  const adminUsers = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Admin",
        full_name: "Administrador",
        email: "admin@onggabriel.org",
        emailVerified: new Date(),
        phone: faker.phone.number({ style: "international" }),
        phoneVerified: new Date(),
        role: [Role.ADMIN, Role.EMPLOYEE],
        date_of_birth: faker.date.past({ years: 30 }),
        image: faker.image.dataUri({ width: 200, height: 200 }),
      },
    ],
  });

  console.log(`✅ Criados ${adminUsers.length} administradores`);

  const employeeUsers = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Psicólogo",
        full_name: "Psicólogo",
        email: "psicologo@onggabriel.org",
        emailVerified: new Date(),
        phone: faker.phone.number({ style: "international" }),
        phoneVerified: new Date(),
        role: [Role.EMPLOYEE],
        date_of_birth: faker.date.past({ years: 10 }),
        image: faker.image.dataUri({ width: 200, height: 200 }),
      },
      {
        name: "Terapeuta",
        full_name: "Terapeuta",
        email: "terapeuta@onggabriel.org",
        emailVerified: new Date(),
        phone: faker.phone.number({ style: "international" }),
        phoneVerified: new Date(),
        role: [Role.EMPLOYEE],
        date_of_birth: faker.date.past({ years: 10 }),
        image: faker.image.dataUri({ width: 200, height: 200 }),
      },
      {
        name: "Assistente",
        full_name: "Assistente",
        email: "assistente@onggabriel.org",
        emailVerified: new Date(),
        phone: faker.phone.number({ style: "international" }),
        phoneVerified: new Date(),
        role: [Role.EMPLOYEE],
        date_of_birth: faker.date.past({ years: 10 }),
        image: faker.image.dataUri({ width: 200, height: 200 }),
      },
    ],
  });

  console.log(`✅ Criados ${employeeUsers.length} funcionários`);

  const patientUsers = await prisma.user.createManyAndReturn({
    data: Array.from(
      { length: faker.number.int({ min: 15, max: 30 }) },
      () => ({
        name: faker.person.firstName(),
        full_name: faker.person.fullName(),
        email: faker.internet.email({ provider: "fakerprovider.com" }),
        emailVerified: new Date(),
        phone: faker.phone.number({ style: "international" }),
        phoneVerified: new Date(),
        role: [Role.PATIENT],
        date_of_birth: faker.date.past({ years: 10 }),
        image: faker.image.dataUri({ width: 200, height: 200 }),
      }),
    ),
  });

  console.log(`✅ Criados ${patientUsers.length} pacientes`);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const anamnesisForms = await prisma.formAnamnesis.createManyAndReturn({
    data: patientUsers.map((patient) => ({
      userId: patient.id,
      canNotDealWithProblems: faker.lorem.sentence(),
      currentlyTakingMedication: faker.lorem.sentence(),
      currentlyUndergoingPsychTreatment: faker.lorem.sentence(),
      difficultiesBasic: faker.helpers.arrayElement(
        Object.values(DifficultiesBasic),
      ),
      difficultiesSleeping: faker.helpers.arrayElement(
        Object.values(DifficultiesSleeping),
      ),
      difficultyEating: faker.helpers.arrayElement(
        Object.values(DifficultiesEating),
      ),
      emotionalState: faker.helpers.arrayElement(Object.values(EmotionalState)),
      hasMedicalDiagnosis: faker.lorem.sentence(),
      haveEmotionalSupport: faker.lorem.sentence(),
      haveFinancialSupport: faker.lorem.sentence(),
      haveSomeoneToTrust: faker.lorem.sentence(),
      monthlyFamilyIncomeCents: faker.number.bigInt({
        min: 100000,
        max: 1000000,
      }),
      monthlyIncomeCents: faker.number.bigInt({ min: 100000, max: 1000000 }),
      occupation: faker.lorem.word(),
      selfDestructiveThoughts: faker.lorem.sentence(),
      socialBenefits: faker.lorem.sentence(),
      whoLivesWith: [faker.helpers.arrayElement(Object.values(WhoLivesWith))],
    })),
  });

  // Criar atendimentos passados, presentes e futuros
  const patientAttendances = await prisma.patientAttendance.createManyAndReturn(
    {
      data: patientUsers.flatMap((patient) => {
        const pastAttendances = Array.from(
          { length: faker.number.int({ min: 0, max: 2 }) },
          () => {
            const attendanceDate = faker.date.past({ years: 1 });
            return {
              patientId: patient.id,
              professionalId: faker.helpers.arrayElement(
                employeeUsers.map((user) => user.id),
              ),
              durationMinutes: faker.number.int({ min: 30, max: 60 }),
              dateAt: attendanceDate,
              note: faker.lorem.sentence(),
              createdAt: attendanceDate,
              updatedAt: attendanceDate,
            } as Prisma.PatientAttendanceUncheckedCreateInput;
          },
        );

        const presentAttendance = {
          patientId: patient.id,
          professionalId: faker.helpers.arrayElement(
            employeeUsers.map((user) => user.id),
          ),
          durationMinutes: faker.number.int({ min: 30, max: 60 }),
          dateAt: new Date(),
          note: faker.lorem.sentence(),
          createdAt: new Date(),
          updatedAt: new Date(),
        } as Prisma.PatientAttendanceUncheckedCreateInput;

        const futureAttendances = Array.from(
          { length: faker.number.int({ min: 0, max: 2 }) },
          () => {
            const attendanceDate = faker.date.future({ years: 1 });
            return {
              patientId: patient.id,
              professionalId: faker.helpers.arrayElement(
                employeeUsers.map((user) => user.id),
              ),
              durationMinutes: faker.number.int({ min: 30, max: 60 }),
              dateAt: attendanceDate,
              note: faker.lorem.sentence(),
              createdAt: attendanceDate,
              updatedAt: attendanceDate,
            } as Prisma.PatientAttendanceUncheckedCreateInput;
          },
        );

        const undefinedAttendances = Array.from(
          { length: faker.number.int({ min: 0, max: 2 }) },
          () =>
            ({
              patientId: patient.id,
              createdAt: faker.date.anytime(),
              updatedAt: faker.date.anytime(),
            }) as Prisma.PatientAttendanceUncheckedCreateInput,
        );

        return [
          ...pastAttendances,
          presentAttendance,
          ...futureAttendances,
          ...undefinedAttendances,
        ];
      }),
    },
  );

  console.log(
    `✅ Criados ${patientAttendances.length} atendimentos para pacientes`,
  );

  const prePsychUsers = await prisma.user.createManyAndReturn({
    data: Array.from(
      { length: faker.number.int({ min: 10, max: 15 }) },
      () => ({
        name: faker.person.firstName(),
        full_name: faker.person.fullName(),
        email: faker.internet.email({ provider: "fakerprovider.com" }),
        emailVerified: new Date(),
        phone: faker.phone.number({ style: "international" }),
        phoneVerified: new Date(),
        role: [Role.PREPSYCHO],
        date_of_birth: faker.date.past({ years: 10 }),
        image: faker.image.dataUri({ width: 200, height: 200 }),
      }),
    ),
  });

  console.log(`✅ Criados ${prePsychUsers.length} pré-psicólogos`);

  const psychCurriculumDocuments = await prisma.document.createManyAndReturn({
    data: await Promise.all(
      prePsychUsers.map(
        async (user) =>
          ({
            userId: user.id,
            name: `Currículo de ${user.full_name}.pdf`,
            category: "CURRICULUM_VITAE",
            mimeType: "APPLICATION_PDF",
            data: await documentPDFBuffer(`Currículo de ${user.full_name}`),
          }) as Prisma.DocumentUncheckedCreateInput,
      ),
    ),
  });

  console.log(
    `✅ Criados ${psychCurriculumDocuments.length} currículos de pré-psicólogos`,
  );

  const psychProofAddressDocuments = await prisma.document.createManyAndReturn({
    data: await Promise.all(
      prePsychUsers.map(
        async (user) =>
          ({
            userId: user.id,
            name: `Comprovante de Endereço de ${user.full_name}.pdf`,
            category: "PROOF_ADDRESS",
            mimeType: "APPLICATION_PDF",
            data: await documentPDFBuffer(
              `Comprovante de Endereço de ${user.full_name}`,
            ),
          }) as Prisma.DocumentUncheckedCreateInput,
      ),
    ),
  });

  console.log(
    `✅ Criados ${psychProofAddressDocuments.length} comprovantes de endereço de pré-psicólogos`,
  );

  const psychs = await prisma.psych.createManyAndReturn({
    data: prePsychUsers.flatMap((user) => {
      return {
        userId: user.id,
        curriculumVitaeId:
          psychCurriculumDocuments.find((doc) => doc.userId === user.id)?.id ||
          null,
        proofAddressId:
          psychProofAddressDocuments.find((doc) => doc.userId === user.id)
            ?.id || null,
        CRP: faker.string.numeric(8),
        hasXpSuicidePrevention: faker.datatype.boolean(),
        note: faker.lorem.sentence(),
        city: faker.location.city(),
        district: faker.location.city(),
        number: faker.string.alphanumeric(6).toUpperCase(),
        state: faker.location.state({ abbreviated: true }),
        street: faker.location.streetAddress(),
        zipCode: faker.location.zipCode(),
        complement: faker.location.streetAddress(),
      } as Prisma.PsychUncheckedCreateInput;
    }),
  });

  console.log(`✅ Criados ${psychs.length} psicólogos`);

  const evaluatedPsychs = faker.helpers
    .arrayElements(prePsychUsers, { min: 2, max: 5 })
    .map((user) => {
      prisma.psych.update({
        where: { userId: user.id },
        data: {
          status: faker.helpers.arrayElement([
            "ADJUSTMENT",
            "APPROVED",
            "FAILED",
          ] as PsychStatus[]),
          evaluatedAt: faker.date.between({
            from: user.createdAt,
            to: new Date(),
          }),
        },
      });
    });

  console.log(`✅ Avaliados ${evaluatedPsychs.length} psicólogos`);
}

const documentPDFBuffer = (text: string): Promise<Uint8Array> => {
  return new Promise((resolve) => {
    const doc = new PDFDocument();
    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => {
      const buffer = Buffer.concat(chunks);
      resolve(new Uint8Array(buffer));
    });

    // Adicionar título
    doc.fontSize(16).font("Helvetica-Bold").text(text, 50, 50);

    // Adicionar linha separadora
    doc.moveDown(2);

    // Adicionar conteúdo aleatório
    doc.fontSize(12).font("Helvetica");

    // Dados pessoais fictícios
    doc.text(`Nome: ${faker.person.fullName()}`, 50, doc.y);
    doc.text(
      `Email: ${faker.internet.email({ provider: "fakerprovider.com" })}`,
      50,
      doc.y + 15,
    );
    doc.text(`Telefone: ${faker.phone.number()}`, 50, doc.y + 15);
    doc.text(
      `Endereço: ${faker.location.streetAddress()}, ${faker.location.city()}, ${faker.location.state()}`,
      50,
      doc.y + 15,
    );
    doc.text(`CEP: ${faker.location.zipCode()}`, 50, doc.y + 15);

    doc.moveDown(2);

    // Experiência profissional
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Experiência Profissional:", 50, doc.y);
    doc.fontSize(12).font("Helvetica");

    for (let i = 0; i < 3; i++) {
      doc.moveDown(1);
      doc.text(
        `• ${faker.company.name()} - ${faker.person.jobTitle()}`,
        60,
        doc.y,
      );
      doc.text(
        `  ${faker.date.past({ years: 5 }).getFullYear()} - ${faker.date.recent().getFullYear()}`,
        60,
        doc.y + 15,
      );
      doc.text(`  ${faker.lorem.sentence()}`, 60, doc.y + 15);
    }

    doc.moveDown(2);

    // Formação acadêmica
    doc
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Formação Acadêmica:", 50, doc.y);
    doc.fontSize(12).font("Helvetica");
    doc.moveDown(1);
    doc.text(
      `• ${faker.company.name()} - ${faker.person.jobArea()}`,
      60,
      doc.y,
    );
    doc.text(
      `  ${faker.date.past({ years: 10 }).getFullYear()} - ${faker.date.past({ years: 6 }).getFullYear()}`,
      60,
      doc.y + 15,
    );

    doc.moveDown(2);

    // Habilidades
    doc.fontSize(14).font("Helvetica-Bold").text("Habilidades:", 50, doc.y);
    doc.fontSize(12).font("Helvetica");
    doc.moveDown(1);

    const skills = [
      faker.hacker.noun(),
      faker.hacker.noun(),
      faker.hacker.noun(),
      faker.color.human(),
      faker.commerce.department(),
    ];

    skills.forEach((skill) => {
      doc.text(`• ${skill}`, 60, doc.y + 15);
    });

    doc.moveDown(2);

    // Observações adicionais
    doc.fontSize(14).font("Helvetica-Bold").text("Observações:", 50, doc.y);
    doc.fontSize(12).font("Helvetica");
    doc.moveDown(1);
    doc.text(faker.lorem.paragraph(), 50, doc.y, {
      width: 500,
      align: "justify",
    });

    doc.end();
  });
};

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
