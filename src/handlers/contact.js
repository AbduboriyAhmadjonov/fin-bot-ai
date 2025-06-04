import keyboard from '../keyboards/main.js';

import { createUser, getUserByTelegramId } from '../services/userService.js';

export default async function contactHandler(bot) {
  bot.on('contact', async (ctx) => {
    const existing = await getUserByTelegramId(ctx.from.id);

    if (!existing) {
      const newUser = await createUser({
        telegramId: ctx.from.id,
        username: ctx.from.username,
        firstName: ctx.from.message.first_name,
        phoneNumber: ctx.message.contact.phone_number,
      });
    }

    // Removing the request keyboard and showing main menu
    await ctx.reply(
      `${existing ? 'Welcome back' : 'Welcome'}, ${newUser.firstName || 'user'}!
✅ Thanks! You're all set.
Now you can start using the bot and track your expenses!
If you want you can enter how much amount of money you have in your account.
Or you can just skip this step entirely or/and enter it later.`,
      keyboard.mainMenu
    );
  });
}
