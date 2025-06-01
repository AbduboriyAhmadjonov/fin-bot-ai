import prisma from '../index.js';

export async function changeLanguage(telegramId, language) {
  return await prisma.user.update({
    where: { telegramId },
    data: { language },
  });
}

export async function changeCurrency(telegramId, currency) {
  return await prisma.user.update({
    where: { telegramId },
    data: { currency },
  });
}

export async function deleteAccount(telegramId) {
  return await prisma.user.delete({
    where: { telegramId },
  });
}
