import type { BotContext } from './types.js';

export function safe(fn: (ctx: BotContext) => Promise<void>): (ctx: BotContext) => Promise<void> {
  return async (ctx) => {
    try {
      await fn(ctx);
    } catch (err) {
      console.error('Handler error:', err);
      try {
        await ctx.reply(await ctx.t('error'));
      } catch {
        await ctx.reply('An error occurred. Please try again.').catch(() => {});
      }
    }
  };
}
