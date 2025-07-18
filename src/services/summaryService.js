import prisma from '../db/prismaClient.js';

export async function getPeriodSummary(userId, period = 'day') {
  const now = new Date();
  let start;
  if (period === 'month') {
    start = new Date(now.getFullYear(), now.getMonth(), 1);
  } else if (period === 'week') {
    const day = now.getDay();
    start = new Date(now);
    start.setDate(now.getDate() - day);
    start.setHours(0, 0, 0, 0);
  } else {
    start = new Date(now.setHours(0, 0, 0, 0));
  }

  const [expenses, incomes] = await Promise.all([
    prisma.expense.groupBy({
      by: ['categoryId'],
      where: { userId, timestamp: { gte: start } },
      _sum: { amount: true },
    }),
    prisma.income.groupBy({
      by: ['categoryId'],
      where: { userId, timestamp: { gte: start } },
      _sum: { amount: true },
    }),
  ]);

  const totalExpense = expenses.reduce((t, e) => t + Number(e._sum.amount || 0), 0);
  const totalIncome = incomes.reduce((t, e) => t + Number(e._sum.amount || 0), 0);

  return { totalExpense, totalIncome, expenses, incomes };
}
