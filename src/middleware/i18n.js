import i18next from 'i18next';
import Backend from 'i18next-fs-backend';
import { telegrafI18next } from 'telegraf-i18next';
import path from 'path';

await i18next.use(Backend).init({
  lng: 'uz', // default fallback
  fallbackLng: 'uz',
  preload: ['uz', 'ru', 'en'],
  backend: {
    loadPath: path.resolve('locales/{{lng}}/translation.json'),
  },
  interpolation: { skipOnVariables: false },
});

export default telegrafI18next(i18next, {
  // chosen (or default) language lives in ctx.session
  sessionName: 'language',
});
