import keyboard from '../keyboards/main.js';

export default async function addIncomeHandler(bot) {
  bot.hears('➕💰 Add Income', async (ctx) => {
    ctx.session ??= {};
    ctx.session.state = 'awaiting_income';

    await ctx.reply(
      'Send your income like `1200000 Salary`, or multiple like:\n`1200000 Salary, 300000 Freelance`.\n\nPress ❌ Cancel to go back.',
      keyboard.cancelKeyboard
    );
  });

  bot.action('CONFIRM_INCOME', async (ctx) => {
    const userId = ctx.from.id;
    const incomes = ctx.session?.incomesToConfirm || [];

    // Save to DB here...
    // for (const inc of incomes) {
    //   await prisma.income.create(...);
    // }

    ctx.session = null;
    await ctx.editMessageText('✅ Income added successfully.');
    await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
  });

  bot.action('CANCEL_INCOME', async (ctx) => {
    // ctx.session = null;
    await ctx.editMessageText('❌ Income entry canceled.');
    await ctx.reply(
      'Try again\nSend your income like `1200000 Salary`, or multiple like:\n`1200000 Salary, 300000 Freelance`.\n\nPress ❌ Cancel to go back.',
      keyboard.cancelKeyboard
    );
    // await ctx.reply('Back to Main Menu.', keyboard.mainMenu);
  });
}
