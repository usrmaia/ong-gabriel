import { Role } from "@prisma/client";

type User = {
  id?: string;
  role: Role[] | string[];
};

type Action = "view" | "list" | "create" | "update" | "delete" | "simpleCreate";

type Resource =
  | "users"
  | "formAnamnesis"
  | "patientAttendance"
  | "psychs"
  | "documents";

export type PolicyStatement = {
  action: Action;
  resource: Resource;
  condition?: (user: User, targetResource: any) => boolean; // Optional condition function
};

export const policies: Readonly<Record<Role | string, PolicyStatement[]>> = {
  ADMIN: [
    {
      action: "view",
      resource: "documents",
    },
  ],
  EMPLOYEE: [
    {
      action: "list",
      resource: "formAnamnesis",
    },
    {
      action: "view",
      resource: "patientAttendance",
    },
    {
      action: "list",
      resource: "patientAttendance",
    },
    {
      action: "create",
      resource: "patientAttendance",
    },
    {
      action: "update",
      resource: "patientAttendance",
    },
  ],
  USER: [
    {
      action: "simpleCreate",
      resource: "psychs",
      condition: (user) => !user.role.includes("EMPLOYEE"),
    },
  ],
  PATIENT: [
    {
      action: "simpleCreate",
      resource: "patientAttendance",
    },
    {
      action: "view",
      resource: "documents",
      condition: (user, targetResource) => user.id === targetResource.userId,
    },
    {
      action: "create",
      resource: "documents",
    },
    {
      action: "delete",
      resource: "documents",
      condition: (user, targetResource) => user.id === targetResource.userId,
    },
  ],
  PREPSYCHO: [],
};

/**
 * Checa se um usuário tem permissão para realizar uma ação específica em um recurso
 *
 * @param user - O usuário para quem verificar as permissões
 * @param action - A ação que está sendo tentada
 * @param resource - O recurso sobre o qual a ação está sendo tentada
 * @param targetResource - Instância específica do recurso, usada para verificações condicionais
 * @returns Um booleano indicando se o usuário está autorizado a realizar a ação
 *
 * @example
 * // Checa se o usuário pode atualizar um post
 * if (can(currentUser, 'update', 'post', { id: '', userId: currentUser.id } as Post)) {
 *   // O usuário pode atualizar o post
 * }
 */
export function can(
  user: User,
  action: Action,
  resource: Resource,
  targetResource?: any,
): boolean {
  if (!user || !user.role) return false;

  for (const role of user.role) {
    const userPolicies = policies[role];
    if (!userPolicies) continue; // Skip roles not defined in policies

    for (const policy of userPolicies) {
      if (policy.action === action && policy.resource === resource) {
        if (policy.condition) {
          if (policy.condition(user, targetResource)) return true;
        } else return true;
      }
    }
  }

  return false;
}
