// packages/db/src/index.ts
import { PrismaClient } from "@prisma/client";

// Type-safe singleton pattern
const prismaClientSingleton = () => new PrismaClient();

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClientSingleton | undefined;
};

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

export type { PrismaClient } from "@prisma/client";

// Optional: Only add this in development for hot-reload prevention
// if (process.env.NODE_ENV !== 'production') {
//   globalForPrisma.prisma = prisma
// }
