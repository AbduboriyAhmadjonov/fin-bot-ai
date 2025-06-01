import prisma from '../index.js';

// CREATE USER
export async function createUser({
  telegramId,
  username,
  firstName,
  phoneNumber,
}) {
  return await prisma.user.create({
    data: { telegramId, username, firstName, phoneNumber },
  });
}

// READ
export async function getUserByTelegramId(telegramId) {
  return await prisma.user.findUnique({
    where: { telegramId },
  });
}

// UPDATE
export async function updateUser(telegramId, updates) {
  return await prisma.user.update({
    where: { telegramId },
    data: updates,
  });
}

// DELETE
export async function deleteUser(telegramId) {
  return await prisma.user.delete({
    where: { telegramId },
  });
}
