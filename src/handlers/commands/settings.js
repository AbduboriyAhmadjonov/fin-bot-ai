import keyboard from '../../keyboards/main.js';

export default async function settingsCommand(bot) {
  bot.command('settings', (ctx) => {
    ctx.reply('What would you like to do?', keyboard.settingsKeyboard);
  });
}
