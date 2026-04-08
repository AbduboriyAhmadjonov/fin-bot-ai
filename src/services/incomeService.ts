import prisma from '../db/prismaClient.js';
import { getUserByTelegramId } from './userService.js';
import type { TransactionEntry } from '../types.js';

export async function addIncome(telegramId: number | bigint, incomes: TransactionEntry[]) {
  if (!Array.isArray(incomes) || !incomes.length)
    throw new Error('No incomes');

  const user = await getUserByTelegramId(telegramId);
  if (!user) throw new Error('User not found');

  return prisma.income.createMany({
    data: incomes.map((inc) => ({
      userId: user.id,
      amount: inc.amount,
      description: inc.description || null,
      categoryId: inc.categoryId || null,
      timestamp: inc.timestamp || new Date(),
    })),
  });
}
