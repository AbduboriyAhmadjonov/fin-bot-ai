import prisma from '../db/index.js';

export async function addCategory({
  telegramId,
  name,
  type,
  isDefault = false,
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

export async function deleteCategory({ categoryId }) {
  return await prisma.category.delete({
    where: { id: categoryId },
  });
}

export async function viewCategories({ userId, type }) {
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
