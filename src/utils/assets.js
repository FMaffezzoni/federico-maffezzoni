import { BACKEND_URL } from '../config';

const PUBLIC_BASE = process.env.PUBLIC_URL || '';

function normalizePublicPath(path) {
  const base = (PUBLIC_BASE || '').replace(/\/$/, '');
  const segment = path.startsWith('/') ? path : `/${path}`;
  if (!base) return segment;
  if (segment === base || segment.startsWith(`${base}/`)) return segment;
  return `${base}${segment}`.replace(/\/{2,}/g, '/');
}

/**
 * Resolves CMS asset URLs (absolute, backend file API, or GitHub Pages relative paths).
 */
export function resolveAssetUrl(url, fallback = '') {
  const value = url || fallback;
  if (!value) return fallback;
  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith('/api/site-profile/files/')) {
    return `${BACKEND_URL}${value}`;
  }
  if (value.startsWith('/')) {
    return normalizePublicPath(value);
  }
  return normalizePublicPath(`/${value}`);
}

/** Suggested filename for CV download links */
export function cvDownloadFilename(url) {
  if (!url) return 'CV.pdf';
  const match = url.match(/\/([^/?#]+\.pdf)(?:\?|#|$)/i);
  return match ? match[1] : 'CV.pdf';
}

export function publicAsset(path) {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  return `${PUBLIC_BASE}${path.startsWith('/') ? path : `/${path}`}`;
}
