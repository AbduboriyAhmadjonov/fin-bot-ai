import keyboard from '../../keyboards/main.js';

export const categoriesHandler = async (bot) => {
  bot.action('MANAGE_CATEGORIES', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      'Please select your preferred language:',
      keyboard.categoriesKeyboard
    );
  });

  bot.action('LANG_EN', async (ctx) => {
    // await saveLanguage(ctx.from.id, 'en');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Language updated to English 🇬🇧');
  });

  bot.action('LANG_RU', async (ctx) => {
    // await saveLanguage(ctx.from.id, 'ru');
    await ctx.answerCbQuery();
    await ctx.editMessageText('✅ Язык обновлен на русский 🇷🇺');
  });

  bot.action('LANG_UZ', async (ctx) => {
    // await saveLanguage(ctx.from.id, 'uz');
    await ctx.answerCbQuery();
    await ctx.editMessageText("✅ Til o'zbek tiliga o'zgartirildi 🇺🇿");
  });
};
