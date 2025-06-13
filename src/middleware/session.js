import { session } from 'telegraf';

export default session({
  defaultSession: () => ({
    isAdmin: false,
    state: null,
    currency: null,
    language: null,
    onboardingStep: null,
  }),
});
