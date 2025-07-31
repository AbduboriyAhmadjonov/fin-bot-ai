import keyboard from '../../keyboards/main.js';
import { getUserByTelegramId } from '../../services/userService.js';

export default async function settingsHandler(bot) {
  bot.hears('⚙️ Settings', async (ctx) => {
    const userInfo = await getUserByTelegramId(ctx.from.id);
    console.log('User Info:', userInfo);

    await ctx.reply(
      await ctx.t('what_would_you_like_to_do'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.action('BACK_TO_MAIN_MENU', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      await ctx.t('back_to_main_menu'),
      keyboard.mainMenu(ctx.t)
    );
  });

  bot.action('BACK_TO_SETTINGS', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      await ctx.t('back_to_settings'),
      keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.hears('❌ Cancel', async (ctx) => {
    ctx.session = null;
    await ctx.reply(
      await ctx.t('cancelled_back_to_main_menu'),
      await keyboard.mainMenu(ctx.t)
    );
  });

  bot.action('CLOSE_SETTINGS', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(await ctx.t('settings_menu_closed'), {
      reply_markup: await keyboard.mainMenu(ctx.t),
    });
  });
}
