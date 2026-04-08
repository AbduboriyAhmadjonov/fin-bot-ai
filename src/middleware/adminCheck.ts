import type { MiddlewareFn } from 'telegraf';
import type { BotContext } from '../types.js';

export function requireAdmin(): MiddlewareFn<BotContext> {
  return async (ctx, next) => {
    if (!ctx.session?.isAdmin) {
      return ctx.reply(await ctx.t('admin_only'));
    }
    return next();
  };
}
