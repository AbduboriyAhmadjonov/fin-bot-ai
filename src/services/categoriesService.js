import prisma from '../db/index.js';

export async function addCategory({ userId, name, type, isDefault = false }) {
  await prisma.category.create({
    data: {
      userId: userId.toString(),
      name: name,
      type: type,
      isDefault,
    },
  });
}

export async function updateCategory({ userId, name, type }) {}

export async function deleteCategory({ userId, name, type }) {}
