import keyboard from '../keyboards/main.js';

export default async function startCommand(bot) {
  bot.command('start', async (ctx) => {
    const firstName = ctx.from.first_name || 'there';

    await ctx.replyWithMarkdownV2(
      `
👋 *Hello ${firstName}*
Welcome to *FinBot AI* \– your personal AI assistant for smarter money management 💸

Here\’s what I can help you with:  
📊 Track your daily expenses  
📥 Record income effortlessly  
📁 Organize spending into smart categories  
🧠 Get personalized insights and budgeting tips  
🎯 Reach your financial goals faster

⚙️ *First things first*  
Please choose your preferred language and currency so I can assist you better 🌍💱

▶️ Type */settings* to get started  
Or just begin by entering your balance or expenses

_You can say something like:_  
• \`I spent \\$12 on lunch\`  
• \`\\+100 from freelance\`  

Let\’s take control of your money \– one message at a time 💪 
Let\’s start by sending your phone number so I can help you better 📱
    `,
      keyboard.contactRequest // keyboard.mainMenu
    );
  });
}
