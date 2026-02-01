---
applyTo: "**"
---

# ONG Gabriel - Instruções Base para GitHub Copilot

## Contexto do Projeto

Você é um assistente especializado para o **sistema ONG Gabriel** - uma plataforma de atendimento psicológico que conecta pacientes, psicólogos e administradores. O sistema gerencia formulários de anamnese, agendamentos, documentos e registros de atendimento.

## Stack Tecnológica Principal

- **Next.js 15** (App Router) com Turbopack
- **Prisma ORM** com PostgreSQL (IDs ULID)
- **NextAuth v5 Beta** (OAuth Google/Facebook)
- **Zod v4** para validação
- **Tailwind CSS v4** + shadcn/ui
- **Vitest** para testes (cobertura mínima 70%)
- **Winston** para logging
- **TypeScript** em modo strict

## Domínio de Negócio Específico

### Entidades Principais

- **User**: Usuários com múltiplas roles (USER, ADMIN, EMPLOYEE, PATIENT, PREPSYCHO)
- **FormAnamnesis**: Formulários de anamnese de pacientes (dados complexos incluindo salário em centavos BigInt)
- **PatientAttendance**: Registros de atendimento paciente-profissional
- **Document**: Sistema de documentos com categorias e tipos MIME
- **Psych**: Registro de psicólogos com status de aprovação ou reprovação

### Regras de Negócio Críticas

- **Transformações de dados**: Valores monetários sempre em centavos (BigInt), telefones sem formatação
- **Validações de idade**: Data de nascimento máximo 140 anos atrás
- **Sistema RBAC**: Verificações de permissão via `can(user, action, resource)`
- **Logging obrigatório**: Todas as operações críticas devem ser logadas

## Padrões de Código Obrigatórios

### Estrutura de Arquivos

```
src/
├── app/                   # Next.js App Router
│   ├── (app)/             # Rotas autenticadas
│   ├── (marketing)/       # Rotas públicas
│   └── api/               # API Routes
├── components/
│   ├── ui/                # shadcn/ui components
│   └── analytics/         # Componentes compartilhados
├── services/              # Lógica de negócio (retorna Result<T>)
├── schemas.ts             # Validações Zod centralizadas
├── permissions.ts         # Sistema RBAC
├── types.ts               # Tipos globais
└── config/                # Configurações e env validation
```

### Padrões de Nomenclatura

- **Arquivos**: kebab-case (.service.ts, .test.ts)
- **Componentes**: PascalCase
- **Funções**: camelCase
- **Constantes**: SCREAMING_SNAKE_CASE
- **Schemas Zod**: PascalCase + "Schema" suffix

### Estrutura de Services

```typescript
// Sempre retornar Result<T>
export const getUsers = async (): Promise<Result<User[]>> => {
  try {
    const data = await prisma.user.findMany();
    return { success: true, data };
  } catch (error) {
    logger.error("Erro ao buscar usuários:", error);
    return {
      success: false,
      error: { errors: ["Erro ao buscar usuários!"] },
      code: 500,
    };
  }
};
```

### Estrutura de Interfaces

```typescript
// Sempre dividir em page.tsx, form.tsx, e actions.ts
// Exemplo: src/app/(app)/users/page.tsx
import { getUsers } from "@/services/user.service";
import { UserForm } from "./form";

export default async function UsersPage() {
  const result = await getUsers();
  if (!result.success) {
    return <div>Erro ao carregar usuários</div>;
  }

  return (
    <div>
      <h1>Usuários</h1>
      <UserForm users={result.data} />
    </div>
  );
}

// Exemplo: src/app/(app)/users/form.tsx
"use client";
import { User } from "@/types";
import { onSubmit } from "./actions";
import React, { useActionState } from "react";

interface UserFormProps {
  users: User[];
}

export function UserForm({ users }: UserFormProps) {
  const [state, formAction] = useActionState(onSubmit, {
    data: users,
    success: false,
    error: { errors: [] },
  });

  return (
    <form action={formAction}>
      {/* Formulário de usuários */}
    </form>
  );
}

// Exemplo: src/app/(app)/users/actions.ts
"use server";
import { createUser } from "@/services/user.service";
import { User } from "@/types";

export const onSubmit = async (formData: FormData) => {
  const formDataObject = Object.fromEntries(formData.entries()) as User;

  const createResult = await createUser(formDataObject);
  if (!createResult.success)
    return { success: false, error: createResult.error };

  return { success: true };
};
```

### Schema Zod com Transformações

```typescript
// Exemplo para valores monetários
const SalarySchema = z
  .union([z.string(), z.number(), z.bigint()])
  .transform<bigint>((value) => {
    if (typeof value === "string") {
      const cleanValue = value.trim().replace(",", ".");
      const floatValue = parseFloat(cleanValue);
      return BigInt(Math.round(floatValue * 100)); // Centavos
    }
    return BigInt(value);
  });

// Exemplo para telefone
const PhoneSchema = z
  .string()
  .min(7, "Telefone é obrigatório.")
  .max(24, "Telefone inválido.")
  .transform((value) => value.replace(/\D/g, ""));
```

## Regras de Desenvolvimento

### Quando gerar código:

1. **Sempre usar server actions** para mutações quando possível
2. **Incluir validação Zod** em todos os inputs de usuário
3. **Implementar verificações de permissão** usando o sistema RBAC
4. **Adicionar logging** para operações críticas
5. **Escrever testes** para lógica de negócio
6. **Comentar código complexo** especialmente transformações de dados

### Responsividade e Acessibilidade

- **Mobile-first**: Sempre iniciar com design mobile
- **Semântica HTML**: Usar elementos semânticos corretos
- **ARIA labels**: Adicionar quando necessário
- **Contraste**: Seguir paleta de cores definida em globals.css
- **Keyboard navigation**: Garantir navegação por teclado

### Testes Obrigatórios

```typescript
// Para services
describe("UserService", () => {
  it("should return success when user exists", async () => {
    const result = await getUserById("valid-id");
    expect(result.success).toBe(true);
    expect(result.data).toBeDefined();
  });

  it("should return error when user not found", async () => {
    const result = await getUserById("invalid-id");
    expect(result.success).toBe(false);
    expect(result.error?.errors).toContain("Usuário não encontrado");
  });
});
```

## Anti-Patterns a Evitar

- ❌ Chamadas diretas ao Prisma fora da camada de services
- ❌ Usar moment.js (usar date-fns)
- ❌ Não validar dados de entrada
- ❌ Não logar operações críticas
- ❌ Não verificar permissões antes de operações
- ❌ Usar UUIDs (projeto usa ULID)
- ❌ Não transformar BigInt para string em respostas JSON

## Comandos de Desenvolvimento

```bash
npm run dev          # Desenvolvimento com Turbopack
npm test             # Rodar testes com cobertura
npm run build        # Build de produção
npx prisma migrate dev --name "descricao"  # Migrate banco
npx prisma studio    # Interface visual do banco
```

Sempre priorize **produtividade**, **qualidade** e **manutenibilidade**. Seja específico e direto ao ponto, fornecendo código completo e funcional.
