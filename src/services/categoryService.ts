import prisma from '../db/prismaClient.js';
import type { CategoryType } from '../db/generated/prisma/default.js';

export async function addCategory({
  telegramId,
  name,
  type,
  isDefault = false,
}: {
  telegramId: number | bigint;
  name: string;
  type: CategoryType;
  isDefault?: boolean;
}) {
  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });

  if (!user) throw new Error('User not found');

  return await prisma.category.create({
    data: {
      userId: user.id,
      name,
      type,
      isDefault,
    },
  });
}

export async function deleteCategory({ categoryId }: { categoryId: string }) {
  return await prisma.category.delete({
    where: { id: categoryId },
  });
}

export async function viewCategories({ userId, type }: { userId: number | bigint; type: CategoryType }) {
  const user = await prisma.user.findUnique({
    where: { telegramId: BigInt(userId) },
  });

  if (!user) return [];

  return await prisma.category.findMany({
    where: {
      userId: user.id,
      type,
    },
    orderBy: { name: 'asc' },
  });
}

export async function ensureDefaultCategories(userId: string) {
  const existing = await prisma.category.findFirst({
    where: { userId, isDefault: true },
  });
  if (existing) return;

  const defaults: Array<{ name: string; type: CategoryType }> = [
    { name: 'Food & Dining', type: 'expense' },
    { name: 'Transport', type: 'expense' },
    { name: 'Housing', type: 'expense' },
    { name: 'Shopping', type: 'expense' },
    { name: 'Salary', type: 'income' },
    { name: 'Gift', type: 'income' },
    { name: 'Freelance', type: 'income' },
    { name: 'Investment', type: 'income' },
  ];

  await prisma.category.createMany({
    data: defaults.map((d) => ({ ...d, userId, isDefault: true })),
    skipDuplicates: true,
  });
}
