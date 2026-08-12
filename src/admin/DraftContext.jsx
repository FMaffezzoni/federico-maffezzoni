import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useContent } from '../content/ContentContext';
import { resetContent, saveContent } from '../content/api';

const DraftContext = createContext(null);

function deepClone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function DraftProvider({ children }) {
  const { raw, setRaw, refresh } = useContent();
  const [draft, setDraft] = useState(() => deepClone(raw));
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!dirty) setDraft(deepClone(raw));
  }, [raw, dirty]);

  const update = useCallback((updater) => {
    setDraft((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      return next;
    });
    setDirty(true);
    setMessage(null);
    setError(null);
  }, []);

  const discard = useCallback(() => {
    setDraft(deepClone(raw));
    setDirty(false);
    setMessage('Changes discarded');
    setError(null);
  }, [raw]);

  const save = useCallback(async () => {
    setSaving(true);
    setError(null);
    try {
      const saved = await saveContent(draft);
      setRaw(saved);
      setDraft(deepClone(saved));
      setDirty(false);
      setMessage('Saved successfully');
    } catch (err) {
      setError(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  }, [draft, setRaw]);

  const resetToDefaults = useCallback(async () => {
    if (!window.confirm('Reset all content to the original site defaults? This cannot be undone.')) return;
    setSaving(true);
    setError(null);
    try {
      const restored = await resetContent();
      setRaw(restored);
      setDraft(deepClone(restored));
      setDirty(false);
      setMessage('Content reset to defaults');
      await refresh();
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setSaving(false);
    }
  }, [refresh, setRaw]);

  const value = useMemo(
    () => ({
      draft,
      update,
      dirty,
      saving,
      message,
      error,
      setMessage,
      setError,
      save,
      discard,
      resetToDefaults
    }),
    [draft, update, dirty, saving, message, error, save, discard, resetToDefaults]
  );

  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft() {
  const ctx = useContext(DraftContext);
  if (!ctx) throw new Error('useDraft must be used within DraftProvider');
  return ctx;
}
