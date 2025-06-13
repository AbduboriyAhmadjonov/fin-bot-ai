import prisma from './src/db/index.js';

export async function utils(bot) {
  // bot.on('text', async (ctx) => {
  //   const telegramId = ctx.from.id;
  //   const user = await prisma.user.findUnique({
  //     where: { telegramId: BigInt(telegramId) },
  //   });
  //   console.log('User:', user);
  //   const categories = await prisma.category.findMany({
  //     where: { userId: user.id },
  //     orderBy: { name: 'asc' },
  //   });
  //   console.log('Categories:', categories);
  // });
}
