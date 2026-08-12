import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { resetPasswordWithToken } from '../content/api';
import { Field, TextInput } from './components/fields';

export default function AdminResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const token = useMemo(() => params.get('token') || '', [params]);
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!token) {
      setError('Missing reset token. Open the link from your email or request a new one.');
      return;
    }
    if (password !== confirm) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      const data = await resetPasswordWithToken(token, password);
      setMessage(data.message || 'Password updated');
      setTimeout(() => navigate('/admin/login', { replace: true }), 1200);
    } catch (err) {
      setError(err.message || 'Reset failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[1.75rem] border border-mist-200 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist-500">Admin access</p>
        <h1 className="mt-2 font-display text-3xl text-mist-900">Reset password</h1>
        <p className="mt-2 text-sm text-mist-600">Choose a new password (at least 8 characters).</p>

        {!token && (
          <p className="mt-4 text-sm text-red-700">
            No token in this link.{' '}
            <Link to="/admin/forgot-password" className="font-semibold underline">
              Request a new reset
            </Link>
            .
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="New password">
            <TextInput
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="new-password"
              required
              minLength={8}
            />
          </Field>
          <Field label="Confirm password">
            <TextInput
              type="password"
              value={confirm}
              onChange={setConfirm}
              autoComplete="new-password"
              required
              minLength={8}
            />
          </Field>
          {error && <p className="text-sm text-red-700">{error}</p>}
          {message && <p className="text-sm text-mist-700">{message}</p>}
          <button
            type="submit"
            disabled={loading || !token}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? 'Updating…' : 'Update password'}
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
