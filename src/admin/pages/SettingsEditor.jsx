import { useState } from 'react';
import { changePassword } from '../../content/api';
import { useDraft } from '../DraftContext';
import { Field, SectionCard, TextInput } from '../components/fields';

export default function SettingsEditor() {
  const { resetToDefaults, saving } = useDraft();
  const [currentPassword, setCurrent] = useState('');
  const [newPassword, setNew] = useState('');
  const [confirm, setConfirm] = useState('');
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const onChangePassword = async (e) => {
    e.preventDefault();
    setMsg('');
    setErr('');
    if (newPassword !== confirm) {
      setErr('New passwords do not match');
      return;
    }
    setBusy(true);
    try {
      await changePassword(currentPassword, newPassword);
      setMsg('Password updated');
      setCurrent('');
      setNew('');
      setConfirm('');
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Settings</h1>
        <p className="mt-2 text-mist-600">Account security and content reset.</p>
      </div>

      <SectionCard title="Change password">
        <form onSubmit={onChangePassword} className="max-w-md space-y-4">
          <Field label="Current password">
            <TextInput type="password" value={currentPassword} onChange={setCurrent} required />
          </Field>
          <Field label="New password" hint="At least 8 characters">
            <TextInput type="password" value={newPassword} onChange={setNew} required minLength={8} />
          </Field>
          <Field label="Confirm new password">
            <TextInput type="password" value={confirm} onChange={setConfirm} required minLength={8} />
          </Field>
          {err && <p className="text-sm text-red-700">{err}</p>}
          {msg && <p className="text-sm text-mist-700">{msg}</p>}
          <button type="submit" disabled={busy} className="btn-primary disabled:opacity-50">
            {busy ? 'Updating…' : 'Update password'}
          </button>
        </form>
      </SectionCard>

      <SectionCard
        title="Danger zone"
        description="Reset restores the original bilingual content shipped with the site. Uploaded files are not deleted."
      >
        <button
          type="button"
          disabled={saving}
          onClick={resetToDefaults}
          className="rounded-full border border-red-300 bg-red-50 px-5 py-2.5 text-sm font-semibold text-red-800 transition hover:bg-red-100 disabled:opacity-50"
        >
          Reset all content to defaults
        </button>
      </SectionCard>
    </div>
  );
}
