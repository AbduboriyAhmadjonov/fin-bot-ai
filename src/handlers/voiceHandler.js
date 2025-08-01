import { Markup } from 'telegraf';
import { processVoiceMessage } from '../services/voiceService.js';
import { handleExpenseInput } from './expenseHandler.js';
import { handleIncomeInput } from './incomeHandler.js';

/**
 * Handles voice messages and processes them for expense/income recording
 * @param {Object} ctx - Telegram context
 */
export async function handleVoiceMessage(ctx) {
  try {
    // 1. Inform user that we're processing their voice message
    await ctx.reply(ctx.i18n.t('processing_voice'));

    // 2. Process the voice message
    const transcript = await processVoiceMessage(ctx);

    // 3. Show the user what was transcribed and ask for confirmation
    const keyboard = Markup.inlineKeyboard([
      [
        Markup.button.callback(
          ctx.i18n.t('expense'),
          `voice_expense:${transcript}`
        ),
        Markup.button.callback(
          ctx.i18n.t('income'),
          `voice_income:${transcript}`
        ),
      ],
      [Markup.button.callback(ctx.i18n.t('cancel'), 'cancel_voice')],
    ]);

    await ctx.reply(
      ctx.i18n.t('voice_transcription', { text: transcript }),
      keyboard
    );
  } catch (error) {
    console.error('Error processing voice message:', error);
    await ctx.reply(ctx.i18n.t('voice_processing_error'));
  }
}

/**
 * Handles the callback when user confirms a voice message as expense
 * @param {Object} ctx - Telegram context
 */
export async function handleVoiceExpenseCallback(ctx) {
  try {
    const transcript = ctx.callbackQuery.data.split(':')[1];

    // Parse transcript for amount and description
    const { amount, description } = parseVoiceTranscript(transcript);

    if (!amount) {
      return await ctx.reply(ctx.i18n.t('voice_parsing_error'));
    }

    // Use the existing expense handler to process the expense
    await handleExpenseInput(ctx, amount, description);
  } catch (error) {
    console.error('Error processing voice expense:', error);
    await ctx.reply(ctx.i18n.t('voice_processing_error'));
  }
}

/**
 * Handles the callback when user confirms a voice message as income
 * @param {Object} ctx - Telegram context
 */
export async function handleVoiceIncomeCallback(ctx) {
  try {
    const transcript = ctx.callbackQuery.data.split(':')[1];

    // Parse transcript for amount and description
    const { amount, description } = parseVoiceTranscript(transcript);

    if (!amount) {
      return await ctx.reply(ctx.i18n.t('voice_parsing_error'));
    }

    // Use the existing income handler to process the income
    await handleIncomeInput(ctx, amount, description);
  } catch (error) {
    console.error('Error processing voice income:', error);
    await ctx.reply(ctx.i18n.t('voice_processing_error'));
  }
}

/**
 * Handles cancellation of voice processing
 * @param {Object} ctx - Telegram context
 */
export async function handleVoiceCancelCallback(ctx) {
  await ctx.answerCbQuery();
  await ctx.reply(ctx.i18n.t('voice_cancelled'));
}

/**
 * Parses the voice transcript to extract amount and description
 * @param {string} transcript - The transcribed text
 * @returns {Object} - Parsed amount and description
 */
function parseVoiceTranscript(transcript) {
  // Expected formats:
  // "1000 food" - amount followed by description
  // "food 1000" - description followed by amount

  const words = transcript.trim().split(/\s+/);
  let amount = null;
  let description = '';

  // Check if first word is a number
  if (!isNaN(parseFloat(words[0]))) {
    amount = parseFloat(words[0]);
    description = words.slice(1).join(' ');
  }
  // Check if last word is a number
  else if (!isNaN(parseFloat(words[words.length - 1]))) {
    amount = parseFloat(words[words.length - 1]);
    description = words.slice(0, words.length - 1).join(' ');
  }
  // Try to find a number in the string
  else {
    for (let i = 0; i < words.length; i++) {
      if (!isNaN(parseFloat(words[i]))) {
        amount = parseFloat(words[i]);
        const firstPart = words.slice(0, i).join(' ');
        const secondPart = words.slice(i + 1).join(' ');
        description = `${firstPart} ${secondPart}`.trim();
        break;
      }
    }
  }

  return { amount, description };
}
