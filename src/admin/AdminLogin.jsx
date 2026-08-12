import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { loginAdmin } from '../content/api';
import { useAdminAuth } from './AdminAuth';
import { Field, TextInput } from './components/fields';

export default function AdminLogin() {
  const { authed, login } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (authed) {
    const to = location.state?.from?.pathname || '/admin';
    return <Navigate to={to} replace />;
  }

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await loginAdmin(username, password);
      login();
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-[1.75rem] border border-mist-200 bg-white/80 p-8 shadow-soft backdrop-blur">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist-500">Admin access</p>
        <h1 className="mt-2 font-display text-3xl text-mist-900">Sign in</h1>
        <p className="mt-2 text-sm text-mist-600">
          Manage profile, pages, services, media, and publications for the public site.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <Field label="Username">
            <TextInput value={username} onChange={setUsername} autoComplete="username" required />
          </Field>
          <Field label="Password">
            <TextInput
              type="password"
              value={password}
              onChange={setPassword}
              autoComplete="current-password"
              required
            />
          </Field>
          {error && <p className="text-sm text-red-700">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-mist-600">
          <Link to="/admin/forgot-password" className="font-semibold text-mist-800 hover:underline">
            Forgot password?
          </Link>
        </p>
      </div>
    </div>
  );
}
