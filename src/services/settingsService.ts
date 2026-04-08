import prisma from '../db/prismaClient.js';

export async function changeLanguage(telegramId: number | bigint, language: string) {
  return await prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: { language },
  });
}

export async function changeCurrency(telegramId: number | bigint, currency: string) {
  return await prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: { currency },
  });
}

export async function deleteAccount(telegramId: number | bigint) {
  return await prisma.user.delete({
    where: { telegramId: BigInt(telegramId) },
  });
}
