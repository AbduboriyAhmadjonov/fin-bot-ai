import prisma from '../db/prismaClient.js';

export async function getOrCreateUser(telegramId, data = {}) {
  const id = BigInt(telegramId);
  let user = await prisma.user.findUnique({ where: { telegramId: id } });
  if (!user) {
    user = await prisma.user.create({
      data: { telegramId: id, firstName: data.firstName || 'User', username: data.username || null, phoneNumber: data.phoneNumber || null },
    });
  }
  return user;
}

// CREATE USER
export async function createUser({ telegramId, username, firstName, phoneNumber }) {
  return await prisma.user.create({
    data: { telegramId: BigInt(telegramId), username, firstName, phoneNumber },
  });
}

export async function createUserIfNotExisted(ctx) {
  const existing = await getUserByTelegramId(ctx.from.id);

  if (!existing) {
    const newUser = await createUser({
      telegramId: ctx.from.id,
      username: ctx.from.username,
      firstName: ctx.message?.from?.first_name || ctx.from.first_name,
      phoneNumber: ctx.message?.contact?.phone_number || null,
    });

    return newUser;
  }

  return existing;
}

// READ
export async function getUserByTelegramId(telegramId) {
  return await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });
}

// UPDATE
export async function updateUser(telegramId, updates) {
  return await prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: updates,
  });
}

// DELETE
export async function deleteUser(telegramId) {
  return await prisma.user.delete({
    where: { telegramId: BigInt(telegramId) },
  });
}
