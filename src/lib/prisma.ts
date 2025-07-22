import { PrismaClient } from "@prisma/client";

import { env } from "@/config/env";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["query", "info", "warn", "error"]
        : ["error"],
  });

if (env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
