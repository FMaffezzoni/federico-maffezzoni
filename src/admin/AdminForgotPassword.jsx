import { useState } from 'react';
import { Link } from 'react-router-dom';
import { forgotPassword } from '../content/api';
import { Field, TextInput } from './components/fields';

export default function AdminForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [resetUrl, setResetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResetUrl('');
    setCopied(false);
    try {
      const data = await forgotPassword(email);
      setMessage(data.message || 'Check your email for a reset link.');
      if (data.resetUrl) setResetUrl(data.resetUrl);
    } catch (err) {
      setError(err.message || 'Request failed');
    } finally {
      setLoading(false);
    }
  };

  const copyLink = async () => {
    if (!resetUrl) return;
    try {
      await navigator.clipboard.writeText(resetUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[1.75rem] border border-mist-200 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist-500">Admin access</p>
        <h1 className="mt-2 font-display text-3xl text-mist-900">Forgot password</h1>
        <p className="mt-2 text-sm text-mist-600">
          Enter the admin email (
          <span className="font-medium text-mist-800">dott.federicomaffezzoni@gmail.com</span>
          ). If it matches, you get a reset link by email — or on this page when email is not
          configured on the server.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Admin email">
            <TextInput
              type="email"
              value={email}
              onChange={setEmail}
              autoComplete="email"
              required
              placeholder="dott.federicomaffezzoni@gmail.com"
            />
          </Field>
          {error && <p className="text-sm text-red-700">{error}</p>}
          {message && <p className="text-sm text-mist-700">{message}</p>}
          {resetUrl && (
            <div className="space-y-3 rounded-xl border border-mist-200 bg-mist-50 p-4">
              <p className="text-sm font-semibold text-mist-900">Your reset link (1 hour)</p>
              <a
                href={resetUrl}
                className="block break-all text-sm font-semibold text-mist-700 underline"
              >
                Open reset page
              </a>
              <button type="button" onClick={copyLink} className="btn-secondary w-full text-sm">
                {copied ? 'Copied' : 'Copy link'}
              </button>
            </div>
          )}
          <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
            {loading ? 'Sending…' : 'Send reset link'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-600">
          <Link to="/admin/login" className="font-semibold text-mist-800 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
