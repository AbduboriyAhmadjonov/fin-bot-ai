import { Telegraf } from 'telegraf';
import type { BotContext, SummaryPeriod } from '../types.js';
import keyboard from '../keyboards/main.js';
import {
  getSummary,
  formatTextSummary,
  generateCSV,
  generatePDF,
} from '../services/summaryService.js';

export default async function summaryHandler(bot: Telegraf<BotContext>): Promise<void> {
  bot.action('VIEW_SUMMARY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      '📊 Select a time period:',
      keyboard.summaryPeriodKeyboard
    );
  });

  bot.hears('📊 View Summary', async (ctx) => {
    await ctx.reply(
      '📊 Select a time period:',
      keyboard.summaryPeriodKeyboard
    );
  });

  const periods: SummaryPeriod[] = ['today', 'week', 'month', 'year', 'all'];
  for (const period of periods) {
    bot.action(`SUMMARY_${period.toUpperCase()}`, async (ctx) => {
      await ctx.answerCbQuery();
      try {
        const summary = await getSummary(ctx.from!.id, period);
        const text = formatTextSummary(summary);

        ctx.session.summaryPeriod = period;

        await ctx.editMessageText(text, {
          parse_mode: 'Markdown',
          ...keyboard.summaryExportKeyboard,
        });
      } catch (err) {
        console.error('Summary error:', err);
        await ctx.editMessageText(await ctx.t('error'));
      }
    });
  }

  bot.action('EXPORT_CSV', async (ctx) => {
    await ctx.answerCbQuery('Generating CSV...');
    try {
      const period = (ctx.session.summaryPeriod || 'month') as SummaryPeriod;
      const summary = await getSummary(ctx.from!.id, period);
      const csv = generateCSV(summary);

      await ctx.replyWithDocument(
        { source: Buffer.from(csv, 'utf-8'), filename: `finbot-summary-${period}.csv` },
        { caption: `📄 Your ${period} financial summary (CSV)` }
      );
    } catch (err) {
      console.error('CSV export error:', err);
      await ctx.reply(await ctx.t('error'));
    }
  });

  bot.action('EXPORT_PDF', async (ctx) => {
    await ctx.answerCbQuery('Generating PDF...');
    try {
      const period = (ctx.session.summaryPeriod || 'month') as SummaryPeriod;
      const summary = await getSummary(ctx.from!.id, period);
      const pdfBuffer = await generatePDF(summary);

      await ctx.replyWithDocument(
        { source: pdfBuffer, filename: `finbot-summary-${period}.pdf` },
        { caption: `📑 Your ${period} financial summary (PDF)` }
      );
    } catch (err) {
      console.error('PDF export error:', err);
      await ctx.reply(await ctx.t('error'));
    }
  });

  bot.action('BACK_TO_SUMMARY', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(
      '📊 Select a time period:',
      keyboard.summaryPeriodKeyboard
    );
  });
}
