import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { buildDefaultContent, contentToLocale } from './defaultContent';
import { fetchContent } from './api';

const ContentContext = createContext(null);

export function ContentProvider({ children }) {
  const [raw, setRaw] = useState(() => buildDefaultContent());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchContent();
      setRaw(data);
    } catch (err) {
      setError(err.message);
      setRaw(buildDefaultContent());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({
      raw,
      setRaw,
      loading,
      error,
      refresh,
      locale: (lang) => contentToLocale(raw, lang)
    }),
    [raw, loading, error, refresh]
  );

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
