/**
 * Resolve public asset paths for GitHub Pages (base) and Render uploads.
 * Federico-only — do not copy from client/src/utils/assets.js (that uses ../config).
 *
 * - /images/...  →  /federico-maffezzoni/images/... on Pages
 * - /uploads/... →  https://your-api.onrender.com/uploads/...
 * - https://...  →  unchanged
 */
export function assetUrl(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path) || path.startsWith('data:')) return path;

  const base = import.meta.env.BASE_URL || '/';

  if (base !== '/' && path.startsWith(base)) return path;

  if (path.startsWith('/uploads/')) {
    const api = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');
    return api ? `${api}${path}` : path;
  }

  const clean = path.replace(/^\//, '');
  return `${base}${clean}`;
}
