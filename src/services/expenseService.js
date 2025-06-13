import prisma from '../db/index.js';

export async function addExpense({ userId, expenses }) {
  // Validate input
  console.log('Adding expenses for user:', userId, 'Expenses:', expenses);

  return await prisma.expense.createMany({
    data: expenses.map((exp) => ({
      userId,
      amount: exp.amount,
      categoryId: exp.categoryId || 'Uncategorized',
      description: exp.description,
      timestamp: exp.timestamp || new Date(),
    })),
  });
}
