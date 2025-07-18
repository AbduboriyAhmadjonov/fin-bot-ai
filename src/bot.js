import { Telegraf } from 'telegraf';
import config from './config/index.js';
import registerHandlers from './handlers/index.js';
import sessionMiddleware from './middleware/session.js';
import rateLimiter from './middleware/rateLimiter.js';
import errorBoundary from './middleware/errorBoundary.js';
import logger from './middleware/logger.js';

import { requireAdmin } from './middleware/adminCheck.js';
import handleStatsCommand from './handlers/commands/handleStats.js';
import { disconnect } from './db/prismaClient.js';

const bot = new Telegraf(config.TELEGRAM_BOT_TOKEN);

// Middleware: Initialize session
bot.use(errorBoundary(logger));
bot.use(rateLimiter());
bot.use(sessionMiddleware);

bot.command('stats', requireAdmin(), async (ctx) => {
  // Stats logic here
  const message = await handleStatsCommand(ctx);

  if (message) {
    await ctx.reply(message);
    return;
  }

  ctx.reply('❌ Bu buyruq faqat adminlar uchun.');
});

// Register all other handlers
registerHandlers(bot);

// Bot launcher
(async () => {
  try {
    bot.launch();
    logger.info('✅ Bot started successfully');
  } catch (error) {
    logger.error({ err: error }, '❌ Failed to launch bot');
  }
})();

// Graceful stop
process.once('SIGINT', async () => {
  await disconnect();
  bot.stop('SIGINT');
});
process.once('SIGTERM', async () => {
  await disconnect();
  bot.stop('SIGTERM');
});
