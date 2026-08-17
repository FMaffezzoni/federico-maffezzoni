import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../content/ContentContext';
import { translations } from './translations';

const LanguageContext = createContext(null);

function mergeLocale(lang, cms) {
  const staticT = translations[lang] || translations.it;
  return {
    ...staticT,
    ...cms,
    nav: { ...staticT.nav, ...(cms.nav || {}) },
    cta: { ...staticT.cta, ...(cms.cta || {}) },
    home: {
      ...staticT.home,
      ...(cms.home || {}),
      seoSections: staticT.home.seoSections,
      faqTitle: staticT.home.faqTitle,
      seoCtaServices: staticT.home.seoCtaServices,
      seoCtaInsights: staticT.home.seoCtaInsights
    },
    services: {
      ...(cms.services || staticT.services),
      catalog: staticT.services.catalog
    },
    seo: staticT.seo,
    insights: staticT.insights
  };
}

export function LanguageProvider({ children }) {
  const { locale, loading } = useContent();
  const location = useLocation();
  const [lang, setLang] = useState(() => localStorage.getItem('fm-lang') || 'it');

  useEffect(() => {
    const pathEn = location.pathname === '/en' || location.pathname.startsWith('/en/');
    const q = new URLSearchParams(location.search).get('lang');
    if (pathEn || q === 'en') setLang('en');
    else if (q === 'it') setLang('it');
  }, [location.pathname, location.search]);

  useEffect(() => {
    localStorage.setItem('fm-lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      t: mergeLocale(lang, locale(lang)),
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
