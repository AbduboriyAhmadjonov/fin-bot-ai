import { Telegraf } from 'telegraf';
import type { BotContext } from '../types.js';
import keyboard from '../keyboards/main.js';
import { createUserIfNotExisted } from '../services/index.js';
import createDefaultCategories from './createDefaultCategories.js';

export default async function contactHandler(bot: Telegraf<BotContext>): Promise<void> {
  bot.on('contact', async (ctx) => {
    const { user, isNew } = await createUserIfNotExisted(ctx);
    await ctx.reply(
      `${isNew ? 'Welcome' : 'Welcome back'}, ${
        user.firstName || 'user'
      }!
✅ Thanks! You're all set.
Now you can start using the bot and track your expenses!
If you want you can enter how much amount of money you have in your account.
Or you can just skip this step entirely or/and enter it later.`,
      keyboard.mainMenu
    );

    createDefaultCategories(ctx);
  });
}
