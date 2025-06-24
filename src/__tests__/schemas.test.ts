import { describe, it, expect } from "vitest";
import { PatientFormAnamnesisSchema, UserBaseInfoSchema } from "../schemas";
import { WhoLivesWith } from "@/generated/prisma";

const userMock = {
  name: "Gabriel",
  full_name: "Nome Teste",
  date_of_birth: new Date("2000-01-01"),
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

  describe("PatientFormAnamnesisSchema", () => {
    it("deve validar quando whoLivesWith contém apenas um valor permitido", async () => {
      const valoresPermitidos = [
        WhoLivesWith.sozinho,
        WhoLivesWith.outras_pessoas,
        WhoLivesWith.familia,
        WhoLivesWith.amigos,
      ];

      for (const valor of valoresPermitidos) {
        const data = { whoLivesWith: [valor] };
        const result = await PatientFormAnamnesisSchema.safeParseAsync(data);

        expect(result.success).toBe(true);
        expect(result.data?.whoLivesWith).toEqual([valor]);
      }
    });

    it("deve falhar quando whoLivesWith contém 'sozinho' e outras opções", async () => {
      const data = {
        whoLivesWith: [WhoLivesWith.sozinho, WhoLivesWith.familia],
      };
      const result = await PatientFormAnamnesisSchema.safeParseAsync(data);
      expect(result.success).toBe(false);

      const errorMessage = result.error?.issues?.[0]?.message;
      expect(errorMessage).toBe(
        "Se 'sozinho' é selecionado, não pode haver outros valores!",
      );
    });
  });
});
