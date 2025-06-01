import keyboard from '../../keyboards/main.js';

export default async function settingsHandler(bot) {
  bot.hears('⚙️ Settings', async (ctx) => {
    await ctx.reply('What would you like to do?', keyboard.settingsKeyboard);
  });

  bot.action('BACK_TO_MAIN_MENU', async (ctx) => {
    await ctx.answerCbQuery(); // Remove loading spinner
    await ctx.editMessageText('Back to Main Menu', keyboard.mainMenu);
  });

  bot.action('BACK_TO_SETTINGS', async (ctx) => {
    await ctx.answerCbQuery(); // Remove loading spinner
    await ctx.editMessageText('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.hears('❌ Cancel', async (ctx) => {
    ctx.session = null;
    await ctx.reply('Cancelled. Back to main menu.', keyboard.mainMenu);
  });

  bot.action('CLOSE_SETTINGS', async (ctx) => {
    await ctx.answerCbQuery(); // Remove loading spinner
    await ctx.editMessageText('Settings menu closed.', {
      reply_markup: null,
    });
  });
}
