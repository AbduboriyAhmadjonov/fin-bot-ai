import prisma from '../db/prismaClient.js';

export async function changeLanguage(telegramId, language) {
  return prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: { language },
  });
}

export async function changeCurrency(telegramId, currency) {
  return prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: { currency },
  });
}

export async function deleteAccount(telegramId) {
  return prisma.user.delete({
    where: { telegramId: BigInt(telegramId) },
  });
}
