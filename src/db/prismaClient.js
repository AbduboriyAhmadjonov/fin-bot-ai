import { PrismaClient } from './generated/prisma/default.js';

let prisma;

export function getPrisma() {
  if (!prisma) {
    prisma = new PrismaClient();
  }
  return prisma;
}

export async function disconnect() {
  if (prisma) {
    await prisma.$disconnect();
  }
}

export default getPrisma();
