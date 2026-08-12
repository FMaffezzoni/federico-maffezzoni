import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useContent } from '../content/ContentContext';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { locale, loading } = useContent();
  const [lang, setLang] = useState(() => localStorage.getItem('fm-lang') || 'it');

  useEffect(() => {
    localStorage.setItem('fm-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: locale(lang),
      loading,
      toggle: () => setLang((prev) => (prev === 'it' ? 'en' : 'it'))
    }),
    [lang, locale, loading]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within LanguageProvider');
  return ctx;
}
