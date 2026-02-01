---
applyTo: "**"
---

# ONG Gabriel - Guia Completo para GitHub Copilot

## Arquitetura e Contexto do Sistema

**ONG Gabriel** é uma plataforma Next.js 15 de atendimento psicológico com sistema RBAC robusto, integrando OAuth, formulários complexos de anamnese e gestão de documentos. O sistema atende 5 tipos de usuários: USER, ADMIN, EMPLOYEE, PATIENT e PREPSYCHO.

### Stack Tecnológica Detalhada

```json
{
  "runtime": "Next.js 15 (App Router + Turbopack)",
  "database": "PostgreSQL + Prisma ORM (ULID IDs)",
  "auth": "NextAuth v5 Beta (OAuth Google/Facebook)",
  "validation": "Zod v4 com transformações customizadas",
  "styling": "Tailwind CSS v4 + shadcn/ui + Radix",
  "testing": "Vitest + Testing Library (70% cobertura mínima)",
  "logging": "Winston com rotação diária",
  "deployment": "Docker + Dokploy (VPS)"
}
```

## Estrutura de Dados Crítica

### Prisma Schema Overview

```prisma
// IDs sempre ULID, nunca UUID
model User {
  id         String @id @default(ulid())
  role       Role[] @default([USER])  // Array de roles
  // Relacionamentos bidirecionais para atendimentos
  PatientAttendancePatient      PatientAttendance[] @relation("PatientAttendancePatient")
  PatientAttendanceProfessional PatientAttendance[] @relation("PatientAttendanceProfessional")
}

// Formulário complexo com validações específicas
model FormAnamnesis {
  monthly_family_income BigInt // Sempre em centavos
  difficulties_basic    DifficultiesBasic[]
  difficulties_eating   DifficultiesEating[]
  who_lives_with        WhoLivesWith[]
}

// Sistema de documentos categorizados
model Document {
  category   DocumentCategory
  mime_type  MimeType
  file_path  String
}
```

### Sistema RBAC Personalizado

```typescript
// src/permissions.ts - Políticas baseadas em ação/recurso
const policies: Record<Role, PolicyStatement[]> = {
  ADMIN: [{ action: "view", resource: "documents" }],
  EMPLOYEE: [
    { action: "list", resource: "formAnamnesis" },
    { action: "create", resource: "patientAttendance" },
  ],
  PATIENT: [
    {
      action: "view",
      resource: "formAnamnesis",
      condition: (user, resource) => user.id === resource.userId,
    },
  ],
};

// Uso em componentes/server actions
import { can } from "@/permissions";
if (!can(user, "create", "patientAttendance")) {
  throw new Error("Sem permissão");
}
```

## Padrões de Validação Zod Específicos

### Transformações de Dados Obrigatórias

```typescript
// Valores monetários → centavos BigInt
const SalarySchema = z
  .union([z.string(), z.number(), z.bigint()])
  .transform<bigint>((value) => {
    if (typeof value === "string") {
      const cleanValue = value.trim().replace(",", ".");
      const floatValue = parseFloat(cleanValue);
      return BigInt(Math.round(floatValue * 100));
    }
    return BigInt(value);
  });

// Telefones → apenas dígitos
const PhoneSchema = z
  .string()
  .min(7, "Telefone é obrigatório.")
  .transform((value) => value.replace(/\D/g, ""));

// Datas de nascimento → validação de idade
const BirthDateSchema = z
  .string()
  .refine((value) => {
    const date = new Date(value);
    const now = new Date();
    const minDate = new Date(now.getFullYear() - 140, 0, 1);
    return date >= minDate && date <= now;
  }, "Data de nascimento inválida.")
  .transform((value) => new Date(value));
```

## Arquitetura de Serviços (Clean Architecture)

### Padrão Result<T> Obrigatório

```typescript
// src/types.ts
export type Result<T = unknown> = {
  success: boolean;
  data?: T;
  error?: $ZodErrorTree<T>;
  code?: number;
};

// src/services/user.service.ts
export const getUserById = async (
  userId: string,
  filter?: Prisma.UserDefaultArgs,
): Promise<Result<User>> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      ...filter,
    });

    if (!user) {
      return {
        success: false,
        error: { errors: ["Usuário não encontrado!"] },
        code: 404,
      };
    }

    return { success: true, data: user };
  } catch (error) {
    logger.error("Erro ao buscar usuário por ID:", error);
    return {
      success: false,
      error: { errors: ["Erro interno do servidor!"] },
      code: 500,
    };
  }
};
```

### Server Actions Pattern

```typescript
"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createUser } from "@/services";
import { can } from "@/permissions";
import { getSessionUser } from "@/utils/auth";

export async function createUserAction(formData: FormData) {
  // 1. Verificar autenticação
  const sessionUser = await getSessionUser();
  if (!sessionUser) {
    throw new Error("Não autenticado");
  }

  // 2. Verificar permissões
  if (!can(sessionUser, "create", "users")) {
    throw new Error("Sem permissão para criar usuários");
  }

  // 3. Validar dados
  const validatedData = UserCreateSchema.parse({
    name: formData.get("name"),
    email: formData.get("email"),
    // ...outros campos
  });

  // 4. Executar operação
  const result = await createUser(validatedData);

  if (!result.success) {
    throw new Error(result.error?.errors?.[0] || "Erro ao criar usuário");
  }

  // 5. Revalidar e redirecionar
  revalidatePath("/users");
  redirect("/users");
}
```

## Componentes shadcn/ui com Tailwind v4

### Formulários Complexos

```tsx
"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createFormAnamnesisAction } from "./actions";

interface FormAnamnesisProps {
  userId: string;
}

export function FormAnamnesis({ userId }: FormAnamnesisProps) {
  const [state, action, isPending] = useActionState(createFormAnamnesisAction, {
    success: true,
  });

  return (
    <form action={action} className="space-y-6 max-w-2xl mx-auto p-6">
      {/* Campo monetário com máscara */}
      <div className="space-y-2">
        <Label htmlFor="monthly_family_income">Renda Familiar Mensal</Label>
        <Input
          id="monthly_family_income"
          name="monthly_family_income"
          type="text"
          placeholder="R$ 0,00"
          className="font-mono"
          required
        />
        {state.error?.properties?.monthly_family_income && (
          <p className="text-sm text-destructive">
            {state.error.properties.monthly_family_income.errors[0]}
          </p>
        )}
      </div>

      {/* Select com enum do Prisma */}
      <div className="space-y-2">
        <Label htmlFor="who_lives_with">Com quem mora?</Label>
        <Select name="who_lives_with" required>
          <SelectTrigger>
            <SelectValue placeholder="Selecione..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="PARENTS">Pais</SelectItem>
            <SelectItem value="SPOUSE">Cônjuge</SelectItem>
            <SelectItem value="ALONE">Sozinho(a)</SelectItem>
            <SelectItem value="RELATIVES">Parentes</SelectItem>
            <SelectItem value="OTHERS">Outros</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Hidden field para userId */}
      <input type="hidden" name="userId" value={userId} />

      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? "Salvando..." : "Salvar Anamnese"}
      </Button>

      {/* Exibir erros gerais */}
      {!state.success && state.error?.errors && (
        <div className="rounded-md bg-destructive/15 p-3">
          <p className="text-sm text-destructive">{state.error.errors[0]}</p>
        </div>
      )}
    </form>
  );
}
```

## Padrões de Teste Específicos

### Mock do Prisma

```typescript
// src/__tests__/__mock__/prisma.ts
import { vi } from "vitest";
import { PrismaClient } from "@prisma/client";

export const prismaMock = {
  user: {
    findMany: vi.fn(),
    findUnique: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  formAnamnesis: {
    findMany: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
  },
  patientAttendance: {
    findMany: vi.fn(),
    create: vi.fn(),
  },
} as unknown as PrismaClient;
```

### Testes de Service

```typescript
// src/__tests__/services/user.service.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { getUserById } from "@/services/user.service";
import { prismaMock } from "../__mock__/prisma";

// Mock do prisma
vi.mock("@/lib/prisma", () => ({
  default: prismaMock,
}));

describe("UserService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("getUserById", () => {
    it("should return user when found", async () => {
      const mockUser = {
        id: "01HQZXVYZ123456789ABCDEFGH",
        name: "Test User",
        email: "test@example.com",
        role: ["USER"],
      };

      prismaMock.user.findUnique.mockResolvedValue(mockUser);

      const result = await getUserById("01HQZXVYZ123456789ABCDEFGH");

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockUser);
      expect(prismaMock.user.findUnique).toHaveBeenCalledWith({
        where: { id: "01HQZXVYZ123456789ABCDEFGH" },
      });
    });

    it("should return error when user not found", async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const result = await getUserById("invalid-id");

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Usuário não encontrado!");
      expect(result.code).toBe(404);
    });

    it("should handle database errors", async () => {
      prismaMock.user.findUnique.mockRejectedValue(new Error("DB Error"));

      const result = await getUserById("01HQZXVYZ123456789ABCDEFGH");

      expect(result.success).toBe(false);
      expect(result.error?.errors).toContain("Erro interno do servidor!");
      expect(result.code).toBe(500);
    });
  });
});
```

## Configuração de Ambiente e Deploy

### Variáveis de Ambiente Críticas

```typescript
// src/config/env.ts - Validação com Zod
const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]),
  DATABASE_URL: z.string().url(),
  AUTH_SECRET: z.string().min(32),
  AUTH_GOOGLE_ID: z.string().optional(),
  AUTH_GOOGLE_SECRET: z.string().optional(),
  LOG_FILE_ENABLED: z.boolean().default(false),
  SECURE_COOKIES_ENABLED: z.boolean().default(false),
});

export const env = envSchema.parse(process.env);
```

### Docker Configuration

```dockerfile
# Dockerfile específico para Next.js 15
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000
CMD ["node", "server.js"]
```

## Fluxos de Desenvolvimento Essenciais

### Mudanças no Schema Prisma

```bash
# 1. Modificar prisma/schema.prisma
# 2. Criar migração
npx prisma migrate dev --name "add_patient_attendance_table"
# 3. Gerar cliente
npx prisma generate
# 4. Atualizar types/schemas se necessário
# 5. Executar testes
npm test
```

### Criação de Nova Feature

1. **Service Layer**: Implementar lógica de negócio em `src/services/`
2. **Schema Validation**: Adicionar schemas Zod em `src/schemas.ts`
3. **Permissions**: Configurar políticas em `src/permissions.ts`
4. **API Routes**: Criar endpoints em `src/app/api/`
5. **Components**: Implementar UI com shadcn/ui
6. **Tests**: Cobertura mínima de 70%

## Armadilhas e Soluções Comuns

### NextAuth v5 Beta Limitations

```typescript
// src/middleware.ts - JWT personalizado devido a limitações da v5 beta
import { jwtVerify } from "jose";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("authjs.session-token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.AUTH_SECRET),
    );
    // Verificar permissões baseado no payload
  } catch {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
}
```

### Serialização BigInt

```typescript
// Sempre transformar BigInt para string em responses
const response = {
  ...data,
  salary: data.salary.toString(), // BigInt → string
};

// Ou usar JSON.stringify com replacer
JSON.stringify(data, (key, value) =>
  typeof value === "bigint" ? value.toString() : value,
);
```

### Performance e Caching

```typescript
// Usar React cache para funções puras
import { cache } from "react";

export const getCachedUser = cache(async (id: string) => {
  return await getUserById(id);
});

// Revalidação estratégica
import { revalidatePath, revalidateTag } from "next/cache";

// Após mutations
revalidatePath("/users");
revalidateTag("user-list");
```
