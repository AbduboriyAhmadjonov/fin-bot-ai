import keyboard from '../../keyboards/main.js';
import { changeCurrency } from '../../services/settingsService.js';

export default async function currencyHandler(bot) {
  bot.action('CHANGE_CURRENCY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select your preferred currency:',
      keyboard.changeCurrencyKeyboard
    );
  });

  bot.action('CURRENCY_USD', async (ctx) => {
    await ctx.answerCbQuery();
    await changeCurrency(ctx.from.id, 'USD');
    await ctx.editMessageText('✅ Currency set to USD 💵');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.action('CURRENCY_EUR', async (ctx) => {
    await ctx.answerCbQuery();
    await changeCurrency(ctx.from.id, 'EUR');
    await ctx.editMessageText('✅ Currency set to EUR 💶');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.action('CURRENCY_UZS', async (ctx) => {
    await ctx.answerCbQuery();
    await changeCurrency(ctx.from.id, 'UZS');
    await ctx.editMessageText('✅ Currency set to UZS 🇺🇿');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });

  bot.action('CURRENCY_RUB', async (ctx) => {
    await ctx.answerCbQuery();
    await changeCurrency(ctx.from.id, 'RUB');
    await ctx.editMessageText('✅ Currency set to RUB 🇷🇺');
    await ctx.replyWithMarkdown('Back to Settings', keyboard.settingsKeyboard);
  });
}
