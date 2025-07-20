import { Role } from "@prisma/client";
import { beforeAll, describe, it, expect } from "vitest";

import { can, policies, PolicyStatement } from "@/permissions";

const mockPolicies: Record<Role, PolicyStatement[]> = {
  ADMIN: [
    { action: "view", resource: "users" },
    { action: "update", resource: "users" },
  ],
  USER: [
    {
      action: "view",
      resource: "users",
      condition: (user: any, targetResource: any) =>
        user?.id !== undefined &&
        targetResource?.id !== undefined &&
        user.id === targetResource.id,
    },
    {
      action: "update",
      resource: "users",
      condition: (user: any, targetResource: any) =>
        user?.id !== undefined &&
        targetResource?.id !== undefined &&
        user.id === targetResource.id,
    },
  ],
  EMPLOYEE: [],
  PATIENT: [],
};

describe("can", () => {
  const adminUser = { id: "1", role: [Role.ADMIN] };
  const normalUser = { id: "2", role: [Role.USER] };
  const employeeUser = { id: "3", role: [Role.EMPLOYEE] };

  beforeAll(() => {
    policies.ADMIN.push(...mockPolicies.ADMIN);
    policies.USER.push(...mockPolicies.USER);
    policies.EMPLOYEE.push(...mockPolicies.EMPLOYEE);
  });

  it("deve retornar false para usuário indefinido", () => {
    // @ts-expect-error
    expect(can(undefined, "view", "users")).toBe(false);
    // @ts-expect-error
    expect(can({}, "view", "users")).toBe(false);
  });

  it("deve retornar false para usuário sem funções", () => {
    expect(can({ id: "4", role: [] }, "view", "users")).toBe(false);
  });

  it("deve retornar false para EMPLOYEE com nenhuma política", () => {
    expect(can(employeeUser, "view", "users")).toBe(false);
  });

  it("deve retornar true para ADMIN com ação permitida", () => {
    expect(can(adminUser, "view", "users")).toBe(true);
    expect(can(adminUser, "update", "users")).toBe(true);
  });

  it("deve retornar false para ADMIN com ação não existente", () => {
    expect(can(adminUser, "create", "users")).toBe(false);
  });

  it("deve retornar false para ADMIN com ação não permitida", () => {
    expect(can(adminUser, "delete", "users")).toBe(false);
  });

  it("deve retornar true para USER com ação permitida e condição atendida", () => {
    expect(can(normalUser, "view", "users", { id: "2" })).toBe(true);
  });

  it("deve retornar false para USER com ação permitida mas condição não atendida", () => {
    expect(can(normalUser, "view", "users", { id: "999" })).toBe(false);
  });

  it("deve retornar false para USER com ação não permitida mas condição atendida", () => {
    expect(can(normalUser, "delete", "users", { id: "2" })).toBe(false);
  });

  it("deve retornar true para USER com ação permitida e condição atendida", () => {
    expect(can(normalUser, "update", "users", { id: "2" })).toBe(true);
  });

  it("deve retornar false para função indefinida", () => {
    // @ts-expect-error
    expect(can({ id: "5" }, "view", "users")).toBe(false);
  });

  it("deve retornar true se o usuário tiver várias funções e uma permitir a ação", () => {
    const multiRoleUser = {
      id: "6",
      role: [Role.USER, Role.ADMIN],
    };
    expect(can(multiRoleUser, "update", "users")).toBe(true);
    expect(can(multiRoleUser, "update", "users", {})).toBe(true);
    expect(can(multiRoleUser, "view", "users")).toBe(true);
    expect(can(multiRoleUser, "view", "users", {})).toBe(true);
  });
});
