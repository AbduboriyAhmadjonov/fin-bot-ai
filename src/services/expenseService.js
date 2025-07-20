import prisma from '../db/prismaClient.js';
import { getUserByTelegramId } from './userService.js';

export async function addExpense(telegramId, expenses) {
  if (!Array.isArray(expenses) || !expenses.length)
    throw new Error('No expenses');

  const user = await getUserByTelegramId(telegramId);

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
