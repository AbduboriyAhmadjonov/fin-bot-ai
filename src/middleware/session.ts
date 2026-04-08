import { session } from 'telegraf';
import type { BotContext } from '../types.js';
import type { MiddlewareFn } from 'telegraf';

const sessionMiddleware: MiddlewareFn<BotContext> = session({
  defaultSession: () => ({
    isAdmin: false,
    botState: null,
    currency: null,
    language: null,
    onboardingStep: null,
    summaryPeriod: null,
    expensesToConfirm: [],
    incomesToConfirm: [],
    __scenes: {},
  }),
// eslint-disable-next-line @typescript-eslint/no-explicit-any
}) as any;

export default sessionMiddleware;
