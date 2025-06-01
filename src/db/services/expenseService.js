import prisma from '../index.js';

export async function addExpense({ userId, expenses }) {
  return await prisma.expense.createMany({
    data: expenses.map((exp) => ({
      userId,
      amount: exp.amount,
      category: exp.category,
      description: exp.description,
      timestamp: exp.timestamp || new Date(),
    })),
  });
}

export async function addIncome({ userId, incomes }) {
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
