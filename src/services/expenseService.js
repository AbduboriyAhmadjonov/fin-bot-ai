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

export async function addIncome({ userId, incomes }) {
  // Validate input

  return await prisma.income.createMany({
    data: incomes.map((inc) => ({
      userId,
      amount: inc.amount,
      categoryId: inc.categoryId,
      description: inc.description,
      timestamp: inc.timestamp || new Date(),
    })),
  });
}
