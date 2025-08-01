import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;
const MAX_LOGIN_ATTEMPTS = 5;
const LOGIN_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
const AUTH_TIMEOUT_MS = 2 * 60 * 1000; // 2 minutes

// Track login attempts and timeouts
const pendingAuthUsers = new Map(); // userId -> {timestamp, timeoutId}
const loginAttempts = new Map(); // userId -> {count, lockUntil}

/**
 * Admin authentication handler with rate limiting
 */
export default function registerAdminLogin(bot) {
  bot.command('admin', async (ctx) => {
    const userId = ctx.from.id;

    // Check if user is locked out
    const userAttempts = loginAttempts.get(userId);
    if (
      userAttempts &&
      userAttempts.lockUntil &&
      userAttempts.lockUntil > Date.now()
    ) {
      const remainingMinutes = Math.ceil(
        (userAttempts.lockUntil - Date.now()) / 60000
      );
      return ctx.reply(
        (await ctx.t('admin_login_attempt_limit')) ||
          `⚠️ Too many failed attempts. Please try again in ${remainingMinutes} minutes.`
      );
    }

    // Clear any existing timeout
    const existingAuth = pendingAuthUsers.get(userId);
    if (existingAuth && existingAuth.timeoutId) {
      clearTimeout(existingAuth.timeoutId);
    }

    // Set auth timeout
    const timeoutId = setTimeout(async () => {
      pendingAuthUsers.delete(userId);
      ctx.reply(
        (await ctx.t('admin_auth_timeout')) ||
          '⏱️ Authentication timed out. Please try again by sending /admin.'
      );
    }, AUTH_TIMEOUT_MS);

    // Set pending auth
    pendingAuthUsers.set(userId, {
      timestamp: Date.now(),
      timeoutId,
    });

    return ctx.reply('🛡 Iltimos, admin parolni kiriting:');
  });

  bot.on('text', async (ctx, next) => {
    const userId = ctx.from.id;
    if (!pendingAuthUsers.has(userId)) return next();

    // Clear the timeout
    const authData = pendingAuthUsers.get(userId);
    if (authData && authData.timeoutId) {
      clearTimeout(authData.timeoutId);
    }

    // Check if user is locked out
    const userAttempts = loginAttempts.get(userId) || { count: 0 };
    if (userAttempts.lockUntil && userAttempts.lockUntil > Date.now()) {
      pendingAuthUsers.delete(userId);
      const remainingMinutes = Math.ceil(
        (userAttempts.lockUntil - Date.now()) / 60000
      );
      return ctx.reply(
        (await ctx.t('admin_login_attempt_limit')) ||
          `⚠️ Too many failed attempts. Please try again in ${remainingMinutes} minutes.`
      );
    }

    const enteredPassword = ctx.message.text;
    const isMatch = await bcrypt.compare(enteredPassword, ADMIN_PASSWORD_HASH);

    if (isMatch) {
      // Reset attempts on successful login
      loginAttempts.delete(userId);
      pendingAuthUsers.delete(userId);
      ctx.session.isAdmin = true;
      return ctx.reply('✅ Siz admin sifatida tasdiqlandingiz.');
    } else {
      // Increment failed attempts
      userAttempts.count += 1;
      console.log(
        `Failed admin login attempt ${userAttempts.count}/${MAX_LOGIN_ATTEMPTS} for user ${userId}`
      );

      if (userAttempts.count >= MAX_LOGIN_ATTEMPTS) {
        userAttempts.lockUntil = Date.now() + LOGIN_TIMEOUT_MS;
        pendingAuthUsers.delete(userId);
        loginAttempts.set(userId, userAttempts);
        return ctx.reply(
          (await ctx.t('admin_login_attempt_limit')) ||
            '⚠️ Too many failed attempts. Please try again in 30 minutes.'
        );
      }

      loginAttempts.set(userId, userAttempts);
      return ctx.reply('❌ Incorrect password. Please try again.');
    }
  });
}
