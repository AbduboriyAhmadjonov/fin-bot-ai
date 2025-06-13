import keyboard from '../../keyboards/main.js';

export default async function currencyHandler(bot) {
  bot.action('CHANGE_CURRENCY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select your preferred currency:',
      keyboard.changeCurrencyKeyboard
    );
  });

  bot.action('CURRENCY_USD', async (ctx) => {
    // await saveCurrency(ctx.from.id, 'usd');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Currency set to USD 💵');
    await ctx.replyWithMarkdown('Settings Menu', keyboard.settingsKeyboard); // extra
  });

  bot.action('CURRENCY_EUR', async (ctx) => {
    // await saveCurrency(ctx.from.id, 'eur');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Currency set to EUR 💶');
    await ctx.replyWithMarkdown('Settings Menu', keyboard.settingsKeyboard); // extra
  });

  bot.action('CURRENCY_UZS', async (ctx) => {
    // await saveCurrency(ctx.from.id, 'uzs');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Currency set to UZS 🇺🇿');
    await ctx.replyWithMarkdown('Settings Menu', keyboard.settingsKeyboard); // extra
  });

  bot.action('CURRENCY_RUB', async (ctx) => {
    // await saveCurrency(ctx.from.id, 'rub');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Currency set to RUB 🇷🇺');
    await ctx.replyWithMarkdown('Settings Menu', keyboard.settingsKeyboard); // extra
  });
}
