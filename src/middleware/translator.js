import { getUserSettings } from '../services/settingsService.js';

class Translator {
  constructor() {
    this.cache = new Map(); // Stores loaded translations: 'en' -> {key: value}
    this.userLangs = new Map(); // Stores user preferences: userId -> 'en'
    this.defaultLang = 'en';
  }

  // Load translation file (with caching)
  async loadTranslations(lang) {
    // Return from cache if already loaded
    if (this.cache.has(lang)) {
      return this.cache.get(lang);
    }

    try {
      // Dynamic import of JSON file
      const { default: translations } = await import(
        `../locales/${lang}.json`,
        {
          with: { type: 'json' },
        }
      );

      // Cache the loaded translations
      this.cache.set(lang, translations);
      console.log(`✅ Loaded language: ${lang}`);
      return translations;
    } catch (error) {
      console.warn(`❌ Language ${lang} not found, using ${this.defaultLang}`);

      // Fallback to default language
      if (lang !== this.defaultLang) {
        return this.loadTranslations(this.defaultLang);
      }

      // If even default fails, return empty object
      return {};
    }
  }

  // Get user's language (fallback to default)
  async getUserLanguage(userId) {
    const cachedLang = this.userLangs.get(userId);
    if (cachedLang) return cachedLang;

    const userSettings = await getUserSettings(userId);
    this.setUserLanguage(userId, userSettings.language);
    return userSettings.language;
  }

  // Set user's preferred language
  setUserLanguage(userId, lang) {
    const current = this.userLangs.get(userId);
    if (current === lang) return; // ✅ Avoiding unnecessary set/log

    this.userLangs.set(userId, lang);
    console.log(`👤 User ${userId} language set to: ${lang}`);
  }

  // Main translation method
  async translate(key, userId, params = {}) {
    const lang = await this.getUserLanguage(userId);
    const translations = await this.loadTranslations(lang);

    // Get translation or return key if not found
    const text = translations[key];
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

export const translator = new Translator();

export function translatorMiddleware() {
  return async (ctx, next) => {
    const userId = ctx.from?.id;
    if (!userId) return next();

    // Step 1: Load from DB/cache via getUserLanguage
    let lang = await translator.getUserLanguage(userId);

    // Step 2: Save into session for future
    if (ctx.session) {
      ctx.session.language = lang;
    }

    // Translation shortcut (always async)
    ctx.t = async (key, params = {}) => {
      return translator.translate(key, userId, params);
    };

    // Allow language changes
    ctx.setLang = async (newLang) => {
      if (!newLang || newLang === lang) return;

      translator.setUserLanguage(userId, newLang);
      if (ctx.session) ctx.session.language = newLang;
    };

    return next();
  };
}
