import keyboard from '../../keyboards/main.js';

export default async function settingsHandler(bot) {
  bot.hears('⚙️ Settings', async (ctx) => {
    await ctx.reply(
      await ctx.t('What would you like to do?'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.action('BACK_TO_MAIN_MENU', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('Back to Main Menu', keyboard.mainMenu(ctx.t));
  });

  bot.action('BACK_TO_SETTINGS', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Back to Settings',
      keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.hears('❌ Cancel', async (ctx) => {
    ctx.session = null;
    await ctx.reply('Cancelled. Back to main menu.', keyboard.mainMenu(ctx.t));
  });

  bot.action('CLOSE_SETTINGS', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText('Settings menu closed.', {
      reply_markup: null,
    });
  });
}
