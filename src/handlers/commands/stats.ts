import type { BotContext } from '../../types.js';
import prisma from '../../db/prismaClient.js';

export default async function statsCommand(ctx: BotContext): Promise<string | void> {
  try {
    if (!ctx.session.isAdmin) return;

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));

    const [totalUsers, todayUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: todayStart,
          },
        },
      }),
    ]);

    const message = `📊 Statistika:

👥 Jami foydalanuvchilar: ${totalUsers}
🆕 Bugun qo'shilganlar: ${todayUsers}`;

    return message;
  } catch (err) {
    console.error('❌ Stats command error:', err);
    await ctx.reply(await ctx.t('error'));
  }
}
