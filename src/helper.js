import { Markup } from 'telegraf';

bot.start((ctx) => {
  ctx.reply(
    'Welcome to FinBot AI! What would you like to do?',
    Markup.inlineKeyboard([
      [Markup.button.callback('➕ Add Expense', 'ADD_EXPENSE')],
      [Markup.button.callback('📊 View Summary', 'VIEW_SUMMARY')],
    ])
  );
});

bot.action('ADD_EXPENSE', (ctx) => {
  ctx.answerCbQuery(); // Remove loading spinner
  ctx.reply('💸 Please send your expense in the format:\n\n`25000 groceries`', {
    parse_mode: 'Markdown',
  });
});

bot.start((ctx) => {
  ctx.reply(
    'Choose an action:',
    Markup.keyboard([['➕ Add Expense', '📊 View Summary'], ['⚙️ Settings']])
      .resize()
      .oneTime()
  );
});
