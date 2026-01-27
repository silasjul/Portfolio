# Translation System

This project uses a custom React Context-based translation system that supports English (en) and Danish (da).

## Features

- 🌍 Two languages: English and Danish
- 💾 Persistent language preference (stored in localStorage)
- 🎨 Visual language switcher with flag icons
- 🔄 Real-time language switching without page reload

## Usage

### Using translations in components

Import the `useLanguage` hook and use the `t()` function:

```tsx
import { useLanguage } from '@/contexts/LanguageContext';

function MyComponent() {
  const { t, language, setLanguage } = useLanguage();

  return (
    <div>
      <h1>{t('hero.title')}</h1>
      <p>Current language: {language}</p>
    </div>
  );
}
```

### Adding new translations

1. Open `src/lib/translations.ts`
2. Add your translation key to both `en` and `da` objects:

```typescript
export const translations: Record<Language, Record<string, string>> = {
  en: {
    // ... existing translations
    'my.new.key': 'My new English text',
  },
  da: {
    // ... existing translations
    'my.new.key': 'Min nye danske tekst',
  },
};
```

3. Use it in your component: `{t('my.new.key')}`

### Translation key naming convention

Use dot notation to organize translations by section:

- `nav.*` - Navigation items
- `hero.*` - Hero section
- `services.*` - Services section
- `works.*` - Works/Projects section
- `about.*` - About section
- `contact.*` - Contact section
- `footer.*` - Footer section

### Language Switcher Component

The `LanguageSwitcher` component is already integrated into the navbar. It displays flag icons for each language and highlights the active language.

## Files

- `src/lib/translations.ts` - All translation strings
- `src/contexts/LanguageContext.tsx` - Context provider and hook
- `src/components/LanguageSwitcher.tsx` - Language switcher UI component

## Architecture Decision

We chose a **state-based approach with localStorage** over URL-based routing because:

1. ✅ Simpler to implement immediately
2. ✅ Works well for single-page applications
3. ✅ Persists user preference across sessions
4. ✅ Can be migrated to Next.js i18n routing later if needed

### Future Migration to Next.js i18n

If you need SEO for different languages or want URL-based language switching (`/en/`, `/da/`), you can migrate to Next.js's built-in internationalization:

1. Configure `next.config.ts` with i18n settings
2. Use Next.js routing for language switching
3. Keep the translation files and keys the same
4. Update `LanguageContext` to sync with Next.js router

## Current Translations

All sections are fully translated:

- ✅ Navbar
- ✅ Hero
- ✅ Services
- ✅ Works/Capabilities
- ✅ About
- ✅ Contact
- ✅ Footer
