import { configDotenv } from 'dotenv';
configDotenv();

import { Telegraf } from 'telegraf';
import { session } from 'telegraf/session';
import register from './register.js';
import prisma from './db/index.js';

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

bot.use(session());

try {
  register(bot);
  const result = await prisma.user.count();
  console.log(`Connected to DB. Users count: ${result}`);
} catch (err) {
  console.error('❌ Failed to connect to database:', err);
}

bot.launch(() => {
  console.log('Bot started');
});
