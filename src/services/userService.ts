import prisma from '../db/prismaClient.js';
import type { BotContext } from '../types.js';

export async function createUser({
  telegramId,
  username,
  firstName,
  phoneNumber,
}: {
  telegramId: number | bigint;
  username?: string;
  firstName: string;
  phoneNumber?: string | null;
}) {
  return await prisma.user.create({
    data: {
      telegramId: BigInt(telegramId),
      username: username ?? null,
      firstName,
      phoneNumber: phoneNumber ?? null,
    },
  });
}

export async function createUserIfNotExisted(ctx: BotContext): Promise<{ user: NonNullable<Awaited<ReturnType<typeof getUserByTelegramId>>>; isNew: boolean }> {
  const existing = await getUserByTelegramId(ctx.from!.id);

  if (!existing) {
    const newUser = await createUser({
      telegramId: ctx.from!.id,
      username: ctx.from!.username,
      firstName: ctx.from!.first_name,
      phoneNumber: (ctx.message && 'contact' in ctx.message) ? ctx.message.contact?.phone_number ?? null : null,
    });

    return { user: newUser, isNew: true };
  }

  return { user: existing, isNew: false };
}

export async function getUserByTelegramId(telegramId: number | bigint) {
  return await prisma.user.findUnique({
    where: { telegramId: BigInt(telegramId) },
  });
}

export async function updateUser(telegramId: number | bigint, updates: Record<string, unknown>) {
  return await prisma.user.update({
    where: { telegramId: BigInt(telegramId) },
    data: updates,
  });
}

export async function deleteUser(telegramId: number | bigint) {
  const exist = await getUserByTelegramId(telegramId);
  if (!exist) {
    throw new Error(`User with telegramId ${telegramId} does not exist.`);
  }

  return await prisma.user.delete({
    where: { telegramId: BigInt(telegramId) },
  });
}
