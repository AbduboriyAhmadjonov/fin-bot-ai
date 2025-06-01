// import cron from 'node-cron';
// import { prisma } from './generated/prisma'; // your prisma client

// // Reset daily AI usage
// cron.schedule('0 0 * * *', async () => {
//   await prisma.setting.updateMany({
//     data: {
//       aiDailyLimit: 3,
//     },
//   });
//   console.log('✅ Daily AI limits reset');
// });

// // Reset weekly insights (e.g., every Monday at 00:00)
// cron.schedule('0 0 * * 1', async () => {
//   await prisma.setting.updateMany({
//     data: {
//       aiWeeklyInsightsLeft: 1,
//     },
//   });
//   console.log('✅ Weekly AI insights reset');
// });
