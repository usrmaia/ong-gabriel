import { describe, it, expect, vi, beforeEach, MockInstance } from "vitest";

import prisma from "../__mock__/prisma";

vi.mock("../../lib/prisma", () => ({ default: prisma }));

import { Role, User } from "@/generated/prisma";
import { addRoleToUser } from "@/services/role.service";

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
  });

  it("Deve retornar 404 se o usuário não for encontrado", async () => {
    prisma.user.findUnique.mockResolvedValue(null);

    const result = await addRoleToUser("not-found", Role.ADMIN);

    expect(result.success).toBe(false);
    expect(result.code).toBe(404);
  });

  it("Deve retornar o usuário se a Role já existir", async () => {
    const mockUserWithRole: User = { ...mockUser, role: ["USER", "ADMIN"] };
    prisma.user.findUnique.mockResolvedValue(mockUserWithRole);

    const result = await addRoleToUser(mockUser.id, Role.ADMIN);

    expect(result.success).toBe(true);
    expect(result.code).toBe(200);
    expect(result.data).toEqual(mockUserWithRole);
  });

  it("Deve atualizar o usuário e adicionar uma nova Role", async () => {
    prisma.user.findUnique.mockResolvedValue(mockUser);

    const updatedUser: User = { ...mockUser, role: ["USER", "ADMIN"] };
    prisma.user.update.mockResolvedValue(updatedUser);

    const result = await addRoleToUser(mockUser.id, Role.ADMIN);

    expect(result.success).toBe(true);
    expect(result.code).toBe(200);
    expect(result.data).toEqual(updatedUser);
  });
});
