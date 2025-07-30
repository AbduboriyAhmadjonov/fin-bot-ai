class SimpleI18n {
  constructor() {
    this.cache = new Map(); // Stores loaded translations: 'en' -> {key: value}
    this.userLangs = new Map(); // Stores user preferences: userId -> 'en'
    this.defaultLang = 'uz';
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

  // Set user's preferred language
  setUserLanguage(userId, lang) {
    this.userLangs.set(userId, lang);
    console.log(`👤 User ${userId} language set to: ${lang}`);
  }

  // Get user's language (fallback to default)
  getUserLanguage(userId) {
    return this.userLangs.get(userId) || this.defaultLang;
  }

  // Main translation method
  async translate(key, userId, params = {}) {
    const lang = this.getUserLanguage(userId);
    const translations = await this.loadTranslations(lang);

    // Get translation or return key if not found
    let text = translations[key];

    if (!text) {
      console.warn(`⚠️  Missing translation: ${key} (${lang})`);
      return key; // Return the key itself as fallback
    }

    // Replace parameters: "Hello {{name}}" -> "Hello John"
    for (const [param, value] of Object.entries(params)) {
      text = text.replace(new RegExp(`{{${param}}}`, 'g'), value);
    }

    return text;
  }
}

// Create singleton instance
export const i18n = new SimpleI18n();

// Telegraf middleware - THIS IS WHERE ctx.t() COMES FROM
export function i18nMiddleware() {
  return (ctx, next) => {
    // Add translation method to context
    ctx.t = (key, params = {}) => {
      return i18n.translate(key, ctx.from?.id, params);
    };

    // Add language setter to context
    ctx.setLang = (lang) => {
      i18n.setUserLanguage(ctx.from?.id, lang);
    };

    // Continue to next middleware/handler
    return next();
  };
}
