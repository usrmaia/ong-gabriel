import { describe, it, expect } from "vitest";
import {
  CreatePatientAttendanceSchema,
  PatientFormAnamnesisSchema,
  UserBaseInfoSchema,
} from "../schemas";
import { WhoLivesWith } from "@/generated/prisma";

const userMock = {
  name: "Gabriel",
  full_name: "Nome Teste",
  date_of_birth: "2000-01-01",
  phone: "(11) 99765-4321",
};

describe("UserBaseInfoSchema", () => {
  it("deve validar um objeto de usuário correto", () => {
    const validUser = userMock;
    const result = UserBaseInfoSchema.safeParse(validUser);
    expect(result.success).toBe(true);
  });

  it("deve falhar se o nome estiver vazio", () => {
    const user = { ...userMock, name: "" };
    const result = UserBaseInfoSchema.safeParse(user);
    expect(result.success).toBe(false);
  });

  it("deve falhar se o nome completo estiver vazio", () => {
    const user = { ...userMock, full_name: "" };
    const result = UserBaseInfoSchema.safeParse(user);
    expect(result.success).toBe(false);
  });

  it("deve falhar se a data de nascimento for muito antiga", () => {
    const oldDate = new Date();
    oldDate.setFullYear(oldDate.getFullYear() - 141);
    const user = { ...userMock, date_of_birth: oldDate };

    const result = UserBaseInfoSchema.safeParse(user);
    expect(result.success).toBe(false);
  });

  it("deve validar se o telefone estiver no formato correto e normalizar", () => {
    const validPhones = [
      "+55 11 99765-4321",
      "+55 (11) 99765-4321",
      "+55 (11) 9 9765-4321",
      "+55 (11) 9 97654321",
      "+55 (11) 9 9765 4321",
      "55 11 9 9765 4321",
    ];
    const resultPhone = "5511997654321";
    validPhones.forEach((phone) => {
      const user = { ...userMock, phone };
      const result = UserBaseInfoSchema.safeParse(user);
      expect(result.success).toBe(true);
      expect(result.data?.phone).toBe(resultPhone);
    });
  });

  it("deve falhar se o telefone for inválido", () => {
    const invalidPhones = ["123456", "+590 700 - 123 - 456 - 789"];
    invalidPhones.forEach((phone) => {
      const user = { ...userMock, phone };
      const result = UserBaseInfoSchema.safeParse(user);
      expect(result.success).toBe(false);
    });
  });

  it("deve validar datas válidas", () => {
    const validDates = ["2000-01-01", "1990-12-31", "1985-06-15", "2024-01-01"];

    validDates.forEach((date) => {
      const user = { ...userMock, date_of_birth: date };
      const result = UserBaseInfoSchema.safeParse(user);
      expect(result.success).toBe(true);
      expect(result.data?.date_of_birth).toBeInstanceOf(Date);
      expect(result.data?.date_of_birth.toISOString().split("T")[0]).toBe(date);
    });
  });
});

describe("PatientFormAnamnesisSchema", () => {
  const formAnamnesisMock = {
    whoLivesWith: [WhoLivesWith.familia],
    monthlyIncomeCents: BigInt(50000),
    monthlyFamilyIncomeCents: BigInt(100000),
    difficultiesBasic: "as_vezes",
    emotionalState: "neutro",
    difficultiesSleeping: "as_vezes",
    difficultyEating: "as_vezes",
  };

  it("deve validar quando whoLivesWith contém apenas um valor permitido", async () => {
    const valoresPermitidos = [
      WhoLivesWith.sozinho,
      WhoLivesWith.outras_pessoas,
      WhoLivesWith.familia,
      WhoLivesWith.amigos,
    ];

    for (const valor of valoresPermitidos) {
      const data = { ...formAnamnesisMock, whoLivesWith: [valor] };
      const result = await PatientFormAnamnesisSchema.safeParseAsync(data);

      expect(result.success).toBe(true);
      expect(result.data?.whoLivesWith).toEqual([valor]);
    }
  });

  it("deve falhar quando whoLivesWith contém 'sozinho' e outras opções", async () => {
    const data = {
      ...formAnamnesisMock,
      whoLivesWith: [WhoLivesWith.sozinho, WhoLivesWith.familia],
    };
    const result = await PatientFormAnamnesisSchema.safeParseAsync(data);
    expect(result.success).toBe(false);

    const errorMessage = result.error?.issues?.[0]?.message;
    expect(errorMessage).toBe(
      "Se 'sozinho' é selecionado, não pode haver outros valores.",
    );
  });

  describe("PatientAttendanceSchema", () => {
    it("deve validar uma data dentro do intervalo permitido", () => {
      const now = new Date();
      const validDate = now.toISOString();

      const result = CreatePatientAttendanceSchema.safeParse({
        patientId: "123",
        dateAt: validDate,
      });

      expect(result.success).toBe(true);
      expect(result.data?.dateAt).toBeInstanceOf(Date);
      expect(result.data?.dateAt?.toISOString()).toBe(validDate);
    });

    it("deve falhar se a data for inválida", () => {
      const result = CreatePatientAttendanceSchema.safeParse({
        patientId: "123",
        dateAt: "data-invalida",
      });
      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(
        "Data do atendimento inválida.",
      );
    });

    it("deve falhar se a data estiver fora do intervalo permitido (muito antiga)", () => {
      const now = new Date();
      const pastDate = new Date(now);
      pastDate.setDate(now.getDate() - 31);

      const result = CreatePatientAttendanceSchema.safeParse({
        patientId: "123",
        dateAt: pastDate.toISOString(),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(
        "Data do atendimento inválida.",
      );
    });

    it("deve falhar se a data estiver fora do intervalo permitido (muito futura)", () => {
      const now = new Date();
      const futureDate = new Date(now);
      futureDate.setDate(now.getDate() + 31);

      const result = CreatePatientAttendanceSchema.safeParse({
        patientId: "123",
        dateAt: futureDate.toISOString(),
      });

      expect(result.success).toBe(false);
      expect(result.error?.issues[0]?.message).toBe(
        "Data do atendimento inválida.",
      );
    });

    it("deve validar datas nos limites do intervalo permitido", () => {
      const now = new Date();
      const minDate = new Date(now);
      minDate.setDate(now.getDate() - 29);
      const maxDate = new Date(now);
      maxDate.setDate(now.getDate() + 29);

      const minDateStr = minDate.toISOString();
      const maxDateStr = maxDate.toISOString();

      const resultMin = CreatePatientAttendanceSchema.safeParse({
        patientId: "123",
        dateAt: minDateStr,
      });
      const resultMax = CreatePatientAttendanceSchema.safeParse({
        patientId: "123",
        dateAt: maxDateStr,
      });

      expect(resultMin.success).toBe(true);
      expect(resultMax.success).toBe(true);
    });
  });
});
