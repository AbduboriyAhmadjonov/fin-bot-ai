import prisma from '../../db/index.js';

export default async function handleStatsCommand(ctx) {
  try {
    if (!ctx.session.isAdmin) return;

    const now = new Date();
    const todayStart = new Date(now.setHours(0, 0, 0, 0));
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [totalUsers, todayUsers] = await Promise.all([
      // last , activeUsers
      prisma.user.count(),
      prisma.user.count({
        where: {
          createdAt: {
            gte: todayStart,
          },
        },
      }),
      // prisma.user.count({
      //   where: {
      //     lastActive: {
      //       gte: yesterday,
      //     },
      //   },
      // }),
    ]);

    /** Active users if you want for future
    bot.use(async (ctx, next) => {
      if (ctx.from) {
        await prisma.user.updateMany({
          where: { telegramId: ctx.from.id },
          data: { lastActive: new Date() },
        });
      }
      return next();
    });
    */

    const message = `📊 Statistika:

👥 Jami foydalanuvchilar: ${totalUsers}
🆕 Bugun qo'shilganlar: ${todayUsers}`;
    // ✅ Faol foydalanuvchilar (24 soat):  ${activeUsers}

    return message;
  } catch (err) {
    console.error('❌ Stats command error:', err);
    return ctx.reply('Xatolik yuz berdi. Qayta urinib ko‘ring.');
  }
}
