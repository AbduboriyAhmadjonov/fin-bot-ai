import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import registerHandlers from './handlers/index.js';
import sessionMiddleware from './middleware/session.js';

import { requireAdmin } from './middleware/adminCheck.js';
import handleStatsCommand from './handlers/commands/handleStats.js';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middleware: Initialize session
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
    console.log(`✅ Bot started successfully`);
  } catch (error) {
    console.error('❌ Failed to launch bot:', error);
  }
})();

// Graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
