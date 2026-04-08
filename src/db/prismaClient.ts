import { PrismaClient } from './generated/prisma/default.js';

let prisma: PrismaClient | undefined;

export function getPrisma(): PrismaClient {
  if (!prisma) {
    prisma = new PrismaClient({
      log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
    });
  }
  return prisma;
}

export async function disconnect(): Promise<void> {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export default getPrisma();
