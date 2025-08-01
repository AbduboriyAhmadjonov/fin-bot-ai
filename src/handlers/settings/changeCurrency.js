import keyboard from '../../keyboards/main.js';
import { changeCurrency } from '../../services/settingsService.js';

/**
 * Currency change handler
 * Allows users to select and persist their preferred currency
 */
export default async function currencyHandler(bot) {
  bot.action('CHANGE_CURRENCY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      await ctx.t('select_your_preferred_currency'),
      await keyboard.changeCurrencyKeyboard(ctx.t)
    );
  });

  bot.action('CURRENCY_USD', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      await changeCurrency(ctx.from.id, 'USD');
      await ctx.editMessageText(`✅ ${await ctx.t('currency_set_to')} USD 💵`);
    } catch (error) {
      console.error('Error saving currency:', error);
      await ctx.editMessageText(
        (await ctx.t('settings_save_error')) ||
          '❌ Failed to save currency setting. Please try again.'
      );
    }
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.action('CURRENCY_EUR', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      await changeCurrency(ctx.from.id, 'EUR');
      await ctx.editMessageText(`✅ ${await ctx.t('currency_set_to')} EUR 💶`);
    } catch (error) {
      console.error('Error saving currency:', error);
      await ctx.editMessageText(
        (await ctx.t('settings_save_error')) ||
          '❌ Failed to save currency setting. Please try again.'
      );
    }
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.action('CURRENCY_UZS', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      await changeCurrency(ctx.from.id, 'UZS');
      await ctx.editMessageText(`✅ ${await ctx.t('currency_set_to')} UZS 🇺🇿`);
    } catch (error) {
      console.error('Error saving currency:', error);
      await ctx.editMessageText(
        (await ctx.t('settings_save_error')) ||
          '❌ Failed to save currency setting. Please try again.'
      );
    }
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });

  bot.action('CURRENCY_RUB', async (ctx) => {
    await ctx.answerCbQuery();
    try {
      await changeCurrency(ctx.from.id, 'RUB');
      await ctx.editMessageText(`✅ ${await ctx.t('currency_set_to')} RUB 🇷🇺`);
    } catch (error) {
      console.error('Error saving currency:', error);
      await ctx.editMessageText(
        (await ctx.t('settings_save_error')) ||
          '❌ Failed to save currency setting. Please try again.'
      );
    }
    await ctx.replyWithMarkdown(
      await ctx.t('back_to_settings'),
      await keyboard.settingsKeyboard(ctx.t)
    );
  });
}
