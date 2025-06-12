import prisma from '../db/index.js';

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
