import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import registerHandlers from './handlers/index.js';
import sessionMiddleware from './middleware/session.js';

import { requireAdmin } from './middleware/adminCheck.js';
import statsCommand from './handlers/commands/stats.js';

import stage from './middleware/stage.js';

dotenv.config();

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Middleware: Initialize session
bot.use(sessionMiddleware);
bot.use(stage.middleware());

bot.command('stats', requireAdmin(), async (ctx) => {
  // Stats logic here
  const message = await statsCommand(ctx);

  if (message) {
    await ctx.reply(message);
    return;
  }

  ctx.reply('❌ Bu buyruq faqat adminlar uchun.');
});

// Register all other handlers
registerHandlers(bot);

bot.hears('➕💸 Add Expense', (ctx) => ctx.scene.enter('expense-wizard'));
bot.hears('➕💰 Add Income', (ctx) => ctx.scene.enter('income-wizard'));

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
