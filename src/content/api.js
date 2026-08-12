const API_BASE = import.meta.env.VITE_API_URL || '';

function authHeaders() {
  const token = localStorage.getItem('fm-admin-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export async function fetchContent() {
  const res = await fetch(`${API_BASE}/api/content`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to load content');
  return res.json();
}

export async function saveContent(content) {
  const res = await fetch(`${API_BASE}/api/admin/content`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(content)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || 'Save failed');
  }
  return res.json();
}

export async function resetContent() {
  const res = await fetch(`${API_BASE}/api/admin/content/reset`, {
    method: 'POST',
    headers: { ...authHeaders() }
  });
  if (!res.ok) throw new Error('Reset failed');
  return res.json();
}

export async function loginAdmin(username, password) {
  const base = (API_BASE || '').replace(/\/$/, '');
  if (!base && import.meta.env.PROD) {
    throw new Error(
      'API URL is not configured. Set GitHub Actions variable VITE_API_URL to your Render URL and redeploy Pages.'
    );
  }
  let res;
  try {
    res = await fetch(`${base}/api/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
  } catch {
    throw new Error(
      'Cannot reach the API. Check VITE_API_URL and that the Render service is awake (open /api/health first).'
    );
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || `Login failed (${res.status})`);
  localStorage.setItem('fm-admin-token', data.token);
  localStorage.setItem('fm-admin-user', data.username);
  return data;
}

export async function changePassword(currentPassword, newPassword) {
  const res = await fetch(`${API_BASE}/api/admin/password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify({ currentPassword, newPassword })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Password change failed');
  return data;
}

export async function forgotPassword(email) {
  const res = await fetch(`${API_BASE}/api/admin/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function resetPasswordWithToken(token, newPassword) {
  const res = await fetch(`${API_BASE}/api/admin/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, newPassword })
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Reset failed');
  return data;
}

export async function uploadFile(file) {
  const form = new FormData();
  form.append('file', file);
  const res = await fetch(`${API_BASE}/api/admin/upload`, {
    method: 'POST',
    headers: { ...authHeaders() },
    body: form
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Upload failed');
  return data;
}

export function logoutAdmin() {
  localStorage.removeItem('fm-admin-token');
  localStorage.removeItem('fm-admin-user');
}

export function isLoggedIn() {
  return Boolean(localStorage.getItem('fm-admin-token'));
}
