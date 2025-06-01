import keyboard from '../keyboards/main.js';

export default async function addExpenseHandler(bot) {
  bot.hears('➕💸 Add Expense', async (ctx) => {
    ctx.session ??= {};
    ctx.session.state = 'awaiting_expense';

    await ctx.reply(
      'Send your expense (e.g., `10000 food`).\nYou can send multiple using commas.\n\nPress ❌ Cancel to go back.',
      keyboard.cancelKeyboard
    );
  });

  bot.action('CONFIRM_EXPENSES', async (ctx) => {
    const userId = ctx.from.id;
    const expenses = ctx.session?.expensesToConfirm || [];

    // Save to DB here...
    // for (const exp of expenses) {
    //   await prisma.expense.create(...);
    // }

    ctx.session = null;
    await ctx.editMessageText('✅ Expenses added successfully.');
    await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
  });

  bot.action('CANCEL_EXPENSES', async (ctx) => {
    // ctx.session = null;
    await ctx.editMessageText('❌ Expense entry canceled.');
    await ctx.reply(
      'Try again\nSend your expense (e.g., `10000 food`).\nYou can send multiple using commas.\n\nPress ❌ Cancel to go back.',
      keyboard.cancelKeyboard
    );
    // await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
  });
}
