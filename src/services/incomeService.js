import prisma from '../db/prismaClient.js';
import { getOrCreateUser } from './userService.js';

export async function addIncomes(telegramId, incomes) {
  if (!Array.isArray(incomes) || !incomes.length) throw new Error('No incomes');
  const user = await getOrCreateUser(telegramId);
  return prisma.income.createMany({
    data: incomes.map((inc) => ({
      userId: user.id,
      amount: inc.amount,
      categoryId: inc.categoryId || null,
      description: inc.description || null,
      timestamp: inc.timestamp || new Date(),
    })),
  });
}
