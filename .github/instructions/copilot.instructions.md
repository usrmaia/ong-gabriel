---
applyTo: "**"
---

# ONG Gabriel - AI Coding Agent Instructions

## Architecture Overview

This is a Next.js 15 psychological care platform using role-based access control with Google/Facebook OAuth. The system manages three main entities: users, patient forms (anamnesis), and patient attendance records.

### Core Authentication & Authorization

- **NextAuth v5 Beta**: OAuth providers configured in `src/auth.ts` with custom session callbacks for role injection
- **Role-based permissions**: Custom RBAC system in `src/permissions.ts` with action/resource policies
- **Middleware protection**: Route protection in `src/middleware.ts` using JWT tokens (not the auth() helper due to v5 beta limitations)
- **Four user roles**: USER, ADMIN, EMPLOYEE, PATIENT with array-based assignment (`user.role: Role[]`)

### Database & Validation Patterns

- **Prisma with PostgreSQL**: Schema defines User, FormAnamnesis, PatientAttendance with ULID IDs
- **Zod v4 schemas**: Centralized validation in `src/schemas.ts` with custom transformers (e.g., currency to BigInt cents)
- **Service layer**: Business logic in `src/services/` returns `Result<T>` objects with success/error/code properties
- **Winston logging**: File rotation enabled via `LOG_FILE_ENABLED` env var, logs to `logs/` directory

### Key Development Workflows

#### Database Changes

```bash
# After modifying schema.prisma
npx prisma migrate dev --name "descriptive_change_name"
npx prisma generate
```

#### Testing with Coverage

```bash
npm test              # Vitest with 70% coverage thresholds
npm run dev           # Uses --turbopack for faster development
```

#### Environment Setup

- Copy `.env.example` to `.env` - includes OAuth keys and feature flags
- `src/config/env.ts` validates all environment variables with Zod schemas

### Critical Patterns

#### API Routes Structure

- Follow `/api/[resource]/route.ts` pattern with HTTP method exports
- Use `src/services` functions, not direct Prisma calls
- Return `NextResponse.json()` with appropriate status codes
- Handle validation via Zod schemas before service calls

#### Form Data Handling

- Complex forms like `FormAnamnesis` use enum-based validation from Prisma types
- Currency inputs transform to BigInt cents storage
- Phone numbers strip formatting during validation
- Date inputs validate age ranges (e.g., birth date max 140 years ago)

#### Permission Checking

```typescript
// Use the policies system from src/permissions.ts
import { policies } from "@/permissions";
// Check if user role has permission for action on resource
```

#### Component Organization

- UI components in `src/components/ui/` follow shadcn/ui patterns
- Route-specific components in `src/app/[role]/` directories
- Shared analytics components in `src/components/analytics/`

### Testing Approach

- **Vitest + React Testing Library**: Configured with jsdom environment
- **Coverage exclusions**: Config files, layout components, test files
- **Mock Prisma**: Use `src/__tests__/__mock__/prisma.ts` for database mocking
- **Service layer tests**: Focus on business logic validation and error handling

### Dependencies Notes

- **Turbopack**: Used in development for faster builds
- **ShadcN/UI + Radix**: Component library with Tailwind CSS v4
- **Date handling**: Use `date-fns` library, not moment.js
- **Icons**: Combination of `lucide-react` and `react-icons`

### Common Gotchas

- NextAuth v5 beta has middleware limitations - custom JWT approach required
- BigInt serialization issues - transform to string for JSON responses
- Prisma array fields require `push` syntax for adding roles
- ULID IDs are used instead of UUIDs throughout the system
