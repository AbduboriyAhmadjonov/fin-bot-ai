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
