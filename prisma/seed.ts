import { PrismaClient, Role } from "../src/generated/prisma";

const prisma = new PrismaClient();

// Verificar se estamos em produção
const isProduction = process.env.NODE_ENV === "production";

async function main() {
  if (isProduction) {
    console.log("🚫 Seed script não executado: ambiente de produção detectado");
    return;
  }

  console.log("🌱 Iniciando seed do banco de dados...");

  // await Promise.all([
  //   prisma.patientAttendance.deleteMany(),
  //   prisma.formAnamnesis.deleteMany(),
  //   prisma.session.deleteMany(),
  //   prisma.account.deleteMany(),
  //   prisma.authenticator.deleteMany(),
  //   prisma.user.deleteMany(),
  // ]);

  const adminUsers = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Admin",
        full_name: "Administrador",
        email: "admin@onggabriel.org",
        emailVerified: new Date(),
        phone: "+55 11 99999-0001",
        phoneVerified: new Date(),
        role: [Role.ADMIN, Role.EMPLOYEE],
        date_of_birth: new Date("1985-03-15"),
      },
    ],
  });

  const employeeUsers = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Psicólogo",
        full_name: "Psicólogo",
        email: "psicologo@onggabriel.org",
        emailVerified: new Date(),
        phone: "+55 11 98888-0001",
        phoneVerified: new Date(),
        role: [Role.EMPLOYEE],
        date_of_birth: new Date("1990-12-10"),
      },
      {
        name: "Terapeuta",
        full_name: "Terapeuta",
        email: "terapeuta@onggabriel.org",
        emailVerified: new Date(),
        phone: "+55 11 98888-0002",
        phoneVerified: new Date(),
        role: [Role.EMPLOYEE],
        date_of_birth: new Date("1988-05-18"),
      },
      {
        name: "Assistente",
        full_name: "Assistente",
        email: "assistente@onggabriel.org",
        emailVerified: new Date(),
        phone: "+55 11 98888-0003",
        phoneVerified: new Date(),
        role: [Role.EMPLOYEE],
        date_of_birth: new Date("1992-09-03"),
      },
    ],
  });

  const patientUsers = await prisma.user.createManyAndReturn({
    data: [
      {
        name: "Maria Santos",
        full_name: "Maria José Santos Silva",
        email: "maria.santos@email.com",
        emailVerified: new Date(),
        phone: "+55 11 97777-0001",
        role: [Role.PATIENT],
        date_of_birth: new Date("1995-02-14"),
      },
      {
        name: "Pedro Oliveira",
        full_name: "Pedro Henrique Oliveira",
        email: "pedro.oliveira@email.com",
        emailVerified: new Date(),
        phone: "+55 11 97777-0002",
        role: [Role.PATIENT],
        date_of_birth: new Date("1987-11-28"),
      },
      {
        name: "Fernanda Costa",
        full_name: "Fernanda Aparecida Costa",
        email: "fernanda.costa@email.com",
        emailVerified: new Date(),
        phone: "+55 11 97777-0003",
        role: [Role.PATIENT],
        date_of_birth: new Date("1993-08-07"),
      },
      {
        name: "Roberto Silva",
        full_name: "Roberto Carlos Silva",
        email: "roberto.silva@email.com",
        phone: "+55 11 97777-0004",
        role: [Role.PATIENT],
        date_of_birth: new Date("1975-04-12"),
      },
      {
        name: "Amanda Ferreira",
        full_name: "Amanda Cristina Ferreira",
        email: "amanda.ferreira@email.com",
        emailVerified: new Date(),
        phone: "+55 11 97777-0005",
        role: [Role.PATIENT],
        date_of_birth: new Date("2000-01-25"),
      },
    ],
  });

  console.log(`✅ Criados ${adminUsers.length} administradores`);
  console.log(`✅ Criados ${employeeUsers.length} funcionários`);
  console.log(`✅ Criados ${patientUsers.length} pacientes`);

  // Criar atendimentos para os pacientes
  const currentDate = new Date();
  const patientAttendances = [];

  // Criar atendimentos passados, presentes e futuros
  for (let i = 0; i < patientUsers.length; i++) {
    const patient = patientUsers[i];
    const professional = employeeUsers[i % employeeUsers.length];

    // Atendimento passado (há 2 semanas)
    const pastDate = new Date(currentDate);
    pastDate.setDate(pastDate.getDate() - 14 - i * 2);

    const pastAttendance = await prisma.patientAttendance.create({
      data: {
        patientId: patient.id,
        professionalId: professional.id,
        dateAt: pastDate,
        note: `Primeira consulta com ${patient.name}. Paciente apresentou boa receptividade ao atendimento. Identificadas questões relacionadas a ${i % 2 === 0 ? "ansiedade" : "autoestima"}. Recomendada continuidade do tratamento.`,
      },
    });
    patientAttendances.push(pastAttendance);

    // Atendimento recente (há 1 semana)
    const recentDate = new Date(currentDate);
    recentDate.setDate(recentDate.getDate() - 7 - i);

    const recentAttendance = await prisma.patientAttendance.create({
      data: {
        patientId: patient.id,
        professionalId: professional.id,
        dateAt: recentDate,
        note: `Segunda sessão com ${patient.name}. Evolução positiva observada. Paciente demonstrou maior abertura para discussão dos temas abordados. Trabalhados exercícios de ${i % 3 === 0 ? "respiração" : i % 3 === 1 ? "mindfulness" : "autoconhecimento"}.`,
      },
    });
    patientAttendances.push(recentAttendance);

    // Atendimento agendado (próxima semana)
    const futureDate = new Date(currentDate);
    futureDate.setDate(futureDate.getDate() + 7 + i);

    const futureAttendance = await prisma.patientAttendance.create({
      data: {
        patientId: patient.id,
        professionalId: professional.id,
        dateAt: futureDate,
        note: null, // Atendimento futuro ainda não realizado
      },
    });
    patientAttendances.push(futureAttendance);

    // Se o paciente tem mais de 2 atendimentos, criar um quarto (mais antigo)
    if (i < 3) {
      const olderDate = new Date(currentDate);
      olderDate.setDate(olderDate.getDate() - 28 - i * 3);

      const olderAttendance = await prisma.patientAttendance.create({
        data: {
          patientId: patient.id,
          professionalId: employeeUsers[(i + 1) % employeeUsers.length].id, // Profissional diferente
          dateAt: olderDate,
          note: `Consulta inicial de triagem com ${patient.name}. Realizada avaliação preliminar. Encaminhado para ${professional.name} para continuidade do tratamento especializado.`,
        },
      });
      patientAttendances.push(olderAttendance);
    }
  }

  // Criar alguns atendimentos extras para demonstrar variedade
  const extraAttendances = await Promise.all([
    // Atendimento em grupo (mesmo horário, profissional diferente)
    prisma.patientAttendance.create({
      data: {
        patientId: patientUsers[0].id,
        professionalId: employeeUsers[1].id,
        dateAt: new Date(currentDate.getTime() + 3 * 24 * 60 * 60 * 1000), // +3 dias
        note: null,
      },
    }),
    // Atendimento de emergência (sem agendamento prévio)
    prisma.patientAttendance.create({
      data: {
        patientId: patientUsers[1].id,
        professionalId: employeeUsers[0].id,
        dateAt: new Date(currentDate.getTime() - 3 * 24 * 60 * 60 * 1000), // -3 dias
        note: "Atendimento de emergência. Paciente procurou a ONG em estado de crise. Realizado acolhimento e estabilização emocional. Reagendamento necessário para próxima semana.",
      },
    }),
  ]);

  patientAttendances.push(...extraAttendances);

  console.log(
    `✅ Criados ${patientAttendances.length} atendimentos de pacientes`,
  );

  // Relatório final
  console.log("\n📊 Resumo do seed:");
  console.log(
    `👥 Total de usuários: ${adminUsers.length + employeeUsers.length + patientUsers.length}`,
  );
  console.log(`   - Administradores: ${adminUsers.length}`);
  console.log(`   - Funcionários/Profissionais: ${employeeUsers.length}`);
  console.log(`   - Pacientes: ${patientUsers.length}`);
  console.log(`📅 Atendimentos: ${patientAttendances.length}`);
  console.log("\n🎉 Seed concluído com sucesso!");
}

main()
  .catch((e) => {
    console.error("❌ Erro durante o seed:", e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
