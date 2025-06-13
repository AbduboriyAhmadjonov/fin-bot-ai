import bcrypt from 'bcryptjs';
import { Markup } from 'telegraf';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

const pendingAuthUsers = new Set();

export default function registerAdminLogin(bot) {
  bot.command('admin', async (ctx) => {
    pendingAuthUsers.add(ctx.from.id);
    return ctx.reply('🛡 Iltimos, admin parolni kiriting:');
  });

  bot.on('text', async (ctx, next) => {
    if (!pendingAuthUsers.has(ctx.from.id)) return next();

    const enteredPassword = ctx.message.text;
    const isMatch = await bcrypt.compare(enteredPassword, ADMIN_PASSWORD_HASH);

    if (isMatch) {
      pendingAuthUsers.delete(ctx.from.id);
      ctx.session.isAdmin = true;
      return ctx.reply('✅ Siz admin sifatida tasdiqlandingiz.');
    } else {
      return ctx.reply('❌ Noto‘g‘ri parol. Yana urinib ko‘ring.');
    }
  });
}
