import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import type { BotContext } from './types.js';
import registerHandlers from './handlers/index.js';
import sessionMiddleware from './middleware/session.js';
import { requireAdmin } from './middleware/adminCheck.js';
import statsCommand from './handlers/commands/stats.js';
import stage from './middleware/stage.js';
import { i18nMiddleware } from './middleware/i18n.js';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const isDevelopment = NODE_ENV === 'development';
const isProduction = NODE_ENV === 'production';

const requiredEnvVars = ['TELEGRAM_BOT_TOKEN'];
const missingEnvVars = requiredEnvVars.filter(
  (varName) => !process.env[varName]
);

if (missingEnvVars.length > 0) {
  console.error(
    '❌ Missing required environment variables:',
    missingEnvVars.join(', ')
  );
  process.exit(1);
}

const bot = new Telegraf<BotContext>(process.env.TELEGRAM_BOT_TOKEN!);

bot.catch(async (err: unknown, ctx: BotContext) => {
  const error = err instanceof Error ? err : new Error(String(err));
  console.error('❌ Bot error occurred:', {
    error: error.message,
    stack: isDevelopment ? error.stack : undefined,
    user: ctx.from?.id,
    chat: ctx.chat?.id,
    update: isDevelopment ? ctx.update : undefined,
  });

  try {
    await ctx.reply(await ctx.t('error'));
  } catch {
    // reply may fail if the context is invalid
  }
});

bot.use(sessionMiddleware);
bot.use(stage.middleware());
bot.use(i18nMiddleware());

if (isDevelopment) {
  bot.use((ctx, next) => {
    console.log('🔍 [DEBUG] Update received:', {
      type: ctx.updateType,
      user: ctx.from?.username || ctx.from?.id,
      text: ctx.message && 'text' in ctx.message ? ctx.message.text : undefined,
      timestamp: new Date().toISOString(),
    });
    return next();
  });
}

bot.command('stats', requireAdmin(), async (ctx) => {
  try {
    const message = await statsCommand(ctx);
    if (message) {
      await ctx.reply(message);
      return;
    }
    await ctx.reply(await ctx.t('admin_only'));
  } catch (error) {
    console.error('❌ Stats command error:', error);
    await ctx.reply(await ctx.t('error.stats'));
  }
});

registerHandlers(bot);

bot.hears('➕💸 Add Expense', async (ctx) => {
  try {
    await ctx.scene.enter('expense-wizard');
  } catch (error) {
    console.error('❌ Error entering expense wizard:', error);
    await ctx.reply(await ctx.t('error.expense'));
  }
});

bot.hears('➕💰 Add Income', async (ctx) => {
  try {
    await ctx.scene.enter('income-wizard');
  } catch (error) {
    console.error('❌ Error entering income wizard:', error);
    await ctx.reply(await ctx.t('error.income'));
  }
});

async function setupWebhook(): Promise<void> {
  if (!isProduction) return;

  const webhookUrl = process.env.WEBHOOK_URL;
  const webhookPort = process.env.WEBHOOK_PORT;
  const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;

  if (!webhookUrl) {
    console.error('❌ WEBHOOK_URL is required for production');
    process.exit(1);
  }

  try {
    await bot.telegram.setWebhook(`${webhookUrl}/bot${telegramBotToken}`);
    // @ts-expect-error startWebhook is marked private but used for webhook mode
    bot.startWebhook(`/bot${telegramBotToken}`, null, Number(webhookPort));

    console.log(`✅ Webhook set to: ${webhookUrl}`);
    console.log(`✅ Webhook server started on port ${webhookPort}`);
  } catch (error) {
    console.error('❌ Failed to setup webhook:', error);
    process.exit(1);
  }
}

(async () => {
  try {
    console.log(`🚀 Starting bot in ${NODE_ENV} mode...`);

    if (isProduction) {
      await setupWebhook();
    } else {
      await bot.launch({
        dropPendingUpdates: true,
      });
      console.log('✅ Bot started successfully in development mode (polling)');
    }

    const botInfo = await bot.telegram.getMe();
    const botUsername = botInfo.username || 'unknown';

    console.log(`📊 Environment: ${NODE_ENV}`);
    console.log(`🤖 Bot username: @${botUsername}`);
  } catch (error) {
    console.error('❌ Failed to launch bot:', error);
    process.exit(1);
  }
})();

const gracefulShutdown = async (signal: string): Promise<void> => {
  console.log(`🛑 Received ${signal}. Starting graceful shutdown...`);
  try {
    await bot.stop(signal);
    console.log('✅ Bot stopped gracefully');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during shutdown:', err);
    process.exit(1);
  }
};

process.once('SIGINT', () => gracefulShutdown('SIGINT'));
process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));

process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  if (isProduction) {
    process.exit(1);
  }
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  if (isProduction) {
    process.exit(1);
  }
});

export default bot;
