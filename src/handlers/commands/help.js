export default async function helpCommand(bot) {
  bot.command('help', async (ctx) => {
    await ctx.reply(`
How can I help you?
If you need assistance, please contact us. 
Telegram: https://t.me/abduboriy05
Website: https://abduboriy.tech
`);
  });
}
