import type { BotContext } from '../types.js';
import type { MiddlewareFn } from 'telegraf';

type Translations = Record<string, string>;

class SimpleI18n {
  cache: Map<string, Translations>;
  userLangs: Map<number, string>;
  defaultLang: string;

  constructor() {
    this.cache = new Map();
    this.userLangs = new Map();
    this.defaultLang = 'uz';
  }

  async loadTranslations(lang: string): Promise<Translations> {
    if (this.cache.has(lang)) {
      return this.cache.get(lang)!;
    }

    try {
      const { default: translations } = await import(
        `../locales/${lang}.json`,
        { with: { type: 'json' } }
      ) as { default: Translations };

      this.cache.set(lang, translations);
      console.log(`✅ Loaded language: ${lang}`);
      return translations;
    } catch {
      console.warn(`❌ Language ${lang} not found, using ${this.defaultLang}`);

      if (lang !== this.defaultLang) {
        return this.loadTranslations(this.defaultLang);
      }

      return {};
    }
  }

  setUserLanguage(userId: number, lang: string): void {
    this.userLangs.set(userId, lang);
    console.log(`👤 User ${userId} language set to: ${lang}`);
  }

  getUserLanguage(userId: number): string {
    return this.userLangs.get(userId) || this.defaultLang;
  }

  async translate(key: string, userId: number, params: Record<string, string> = {}): Promise<string> {
    const lang = this.getUserLanguage(userId);
    const translations = await this.loadTranslations(lang);

    let text = translations[key];

    if (!text) {
      console.warn(`⚠️  Missing translation: ${key} (${lang})`);
      return key;
    }

    for (const [param, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
    }

    return text;
  }
}

export const i18n = new SimpleI18n();

export function i18nMiddleware(): MiddlewareFn<BotContext> {
  return (ctx, next) => {
    ctx.t = (key: string, params: Record<string, string> = {}) => {
      return i18n.translate(key, ctx.from?.id ?? 0, params);
    };

    ctx.setLang = (lang: string) => {
      i18n.setUserLanguage(ctx.from?.id ?? 0, lang);
    };

    return next();
  };
}
