import keyboard from '../keyboards/main.js';
import { createUserIfNotExisted } from '../services/index.js';
import createDefaultCategories from './createDefaultCategories.js';

export default async function contactHandler(bot) {
  bot.on('contact', async (ctx) => {
    const existing = await createUserIfNotExisted(ctx);
    // Removing the request keyboard and showing main menu
    await ctx.reply(
      `${existing ? 'Welcome back' : 'Welcome'}, ${
        existing.firstName || 'user'
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
