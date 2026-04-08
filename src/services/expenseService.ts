import prisma from '../db/prismaClient.js';
import { getUserByTelegramId } from './userService.js';
import type { TransactionEntry } from '../types.js';

export async function addExpense(telegramId: number | bigint, expenses: TransactionEntry[]) {
  if (!Array.isArray(expenses) || !expenses.length)
    throw new Error('No expenses');

  const user = await getUserByTelegramId(telegramId);
  if (!user) throw new Error('User not found');

  return prisma.expense.createMany({
    data: expenses.map((e) => ({
      userId: user.id,
      amount: e.amount,
      description: e.description || null,
      categoryId: e.categoryId || null,
      timestamp: e.timestamp || new Date(),
    })),
  });
}
