import { PrismaClient } from "@/generated/prisma";
// Não alterar a ordem de importação, pois é importante para o mock funcionar corretamente.
import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";

const prisma = mockDeep<PrismaClient>();

beforeEach(() => {
  mockReset(prisma);
});

export default prisma;
