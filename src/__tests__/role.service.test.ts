import { describe, it, expect, vi, beforeEach, MockInstance } from "vitest";
import { addRoleToUser } from "@/services/role.service";
import prisma from "@/lib/prisma";
import logger from "@/config/logger";
import { Role, User } from "@/generated/prisma";

vi.mock("@/lib/prisma");
vi.mock("@/config/logger");

const mockUser: User = {
  id: "user-1",
  name: "Test User",
  full_name: "Test User Full",
  email: "test@example.com",
  emailVerified: null,
  date_of_birth: null,
  phone: null,
  phoneVerified: null,
  image: null,
  role: ["USER"],
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe("addRoleToUser", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    prisma.user.findUnique = vi.fn();
    prisma.user.update = vi.fn();
  });

  it("Deve retornar 404 se o usuário não for encontrado", async () => {
    (prisma.user.findUnique as unknown as MockInstance).mockResolvedValue(null);

    const result = await addRoleToUser("not-found", "ADMIN" as Role);

    expect(result.success).toBe(false);
    expect(result.code).toBe(404);
    expect(result.error?.errors).toContain("Usuário não encontrado!");
  });

  it("Deve retornar o usuário se a Role já existir", async () => {
    (prisma.user.findUnique as unknown as MockInstance).mockResolvedValue({
      id: mockUser.id,
      role: ["USER", "ADMIN"],
    });

    const result = await addRoleToUser(mockUser.id, "ADMIN" as Role);

    expect(result.success).toBe(true);
    expect(result.code).toBe(200);
    expect(result.data?.id).toBe(mockUser.id);
  });

  it("Deve atualizar o usuário e adicionar uma nova Role", async () => {
    (prisma.user.findUnique as unknown as MockInstance).mockResolvedValue({
      id: mockUser.id,
      role: ["USER"],
    });

    const updatedUser = { ...mockUser, role: ["USER", "ADMIN"] };
    (prisma.user.update as unknown as MockInstance).mockResolvedValue(
      updatedUser,
    );

    const result = await addRoleToUser(mockUser.id, "ADMIN" as Role);

    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: mockUser.id },
      data: { role: { push: "ADMIN" } },
    });
    expect(result.success).toBe(true);
    expect(result.code).toBe(200);
    expect(result.data?.role).toContain("ADMIN");
  });

  it("Deve lidar com erros e registrá-los", async () => {
    (prisma.user.findUnique as unknown as MockInstance).mockRejectedValue(
      new Error("DB error"),
    );

    const result = await addRoleToUser(mockUser.id, "ADMIN" as Role);

    expect(logger.error).toHaveBeenCalled();
    expect(result.success).toBe(false);
    expect(result.code).toBe(500);
    expect(result.error?.errors).toContain(
      "Erro ao adicionar role ao usuário!",
    );
  });
});
