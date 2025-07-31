import keyboard from '../../keyboards/main.js';

export default async function settingsCommand(bot) {
  bot.command('settings', async (ctx) => {
    ctx.reply(
      await ctx.t('What would you like to do?'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });
}
