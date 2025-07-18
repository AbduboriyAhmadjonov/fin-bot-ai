import prisma from '../db/prismaClient.js';
import { getOrCreateUser } from './userService.js';
export async function addExpenses(telegramId, expenses) {
  if (!Array.isArray(expenses) || !expenses.length) throw new Error('No expenses');
  const user = await getOrCreateUser(telegramId);
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
