import { session } from 'telegraf';

export default session({
  defaultSession: () => ({
    state: null,
    currency: null,
    language: null,
    onboardingStep: null,
  }),
});
