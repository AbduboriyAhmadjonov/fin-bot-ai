import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import registerHandlers from './handlers/index.js';
import sessionMiddleware from './middleware/session.js';
import { requireAdmin } from './middleware/adminCheck.js';
import statsCommand from './handlers/commands/stats.js';
import stage from './middleware/stage.js';
import i18nMiddleware from './middleware/i18n.js';

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

const botConfig = {
  polling: isDevelopment,
};

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN, botConfig);

bot.catch((err, ctx) => {
  console.error('❌ Bot error occurred:', {
    error: err.message,
    stack: isDevelopment ? err.stack : undefined,
    user: ctx.from?.id,
    chat: ctx.chat?.id,
    update: isDevelopment ? ctx.update : undefined,
  });

  if (ctx.reply) {
    ctx.reply("❌ Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.");
  }
});

bot.use(sessionMiddleware);
bot.use(stage.middleware());
bot.use(i18nMiddleware);

if (isDevelopment) {
  bot.use((ctx, next) => {
    console.log('🔍 [DEBUG] Update received:', {
      type: ctx.updateType,
      user: ctx.from?.username || ctx.from?.id,
      text: ctx.message?.text,
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
    ctx.reply('❌ Bu buyruq faqat adminlar uchun.');
  } catch (error) {
    console.error('❌ Stats command error:', error);
    ctx.reply('❌ Statistikani olishda xatolik yuz berdi.');
  }
});

registerHandlers(bot);

bot.hears('➕💸 Add Expense', (ctx) => {
  try {
    ctx.scene.enter('expense-wizard');
  } catch (error) {
    console.error('❌ Error entering expense wizard:', error);
    ctx.reply("❌ Xarajat qo'shishda xatolik yuz berdi.");
  }
});

bot.hears('➕💰 Add Income', (ctx) => {
  try {
    ctx.scene.enter('income-wizard');
  } catch (error) {
    console.error('❌ Error entering income wizard:', error);
    ctx.reply("❌ Daromad qo'shishda xatolik yuz berdi.");
  }
});

// Webhook setup for production
async function setupWebhook() {
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

    bot.startWebhook(`/bot${telegramBotToken}`, null, webhookPort);

    if (!ctx.session.language) {
      const tgLang = ctx.from.language_code?.slice(0, 2); // "ru", "en", "uz"
      ctx.session.language = ['uz', 'ru', 'en'].includes(tgLang)
        ? tgLang
        : 'uz';
      ctx.i18n.locale(ctx.session.language);
    }

    await ctx.reply(ctx.i18n.t('welcome', { name: ctx.from.first_name }));
    console.log(`✅ Webhook set to: ${webhookUrl}`);
    console.log(`✅ Webhook server started on port ${webhookPort}`);
  } catch (error) {
    console.error('❌ Failed to setup webhook:', error);
    process.exit(1);
  }
}

// Bot launcher
(async () => {
  try {
    console.log(`🚀 Starting bot in ${NODE_ENV} mode...`);

    if (isProduction) {
      await setupWebhook();
    } else {
      await bot.launch({
        polling: true,
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

// Graceful shutdown
const gracefulShutdown = async (signal) => {
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

// Handle uncaught exceptions
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
