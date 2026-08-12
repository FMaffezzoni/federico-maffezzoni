import { Link } from 'react-router-dom';
import { Save, RotateCcw, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useDraft } from '../DraftContext';

export default function SaveBar() {
  const { dirty, saving, message, error, save, discard } = useDraft();

  return (
    <div className="sticky top-0 z-20 -mx-1 mb-6 border-b border-mist-200/80 bg-[#f4f7f6]/95 px-1 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="min-h-[1.5rem] text-sm">
          {error && (
            <p className="inline-flex items-center gap-1.5 text-red-700">
              <AlertCircle className="h-4 w-4" />
              {error}
            </p>
          )}
          {!error && message && (
            <p className="inline-flex items-center gap-1.5 text-mist-700">
              <CheckCircle2 className="h-4 w-4" />
              {message}
            </p>
          )}
          {!error && !message && dirty && (
            <p className="text-amber-800">Unsaved changes</p>
          )}
          {!error && !message && !dirty && (
            <p className="text-mist-500">All changes saved</p>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/"
            target="_blank"
            className="rounded-full border border-mist-300 bg-white/70 px-4 py-2 text-sm font-semibold text-mist-800 transition hover:bg-white"
          >
            View site
          </Link>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={discard}
            className="inline-flex items-center gap-1.5 rounded-full border border-mist-300 bg-white/70 px-4 py-2 text-sm font-semibold text-mist-700 transition enabled:hover:bg-white disabled:opacity-40"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Discard
          </button>
          <button
            type="button"
            disabled={!dirty || saving}
            onClick={save}
            className="inline-flex items-center gap-1.5 rounded-full bg-mist-700 px-4 py-2 text-sm font-semibold text-white transition enabled:hover:bg-mist-800 disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" />
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
