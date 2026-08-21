/** Canonical site config. Live site: https://federicomaffezzoni.it */
export const SITE = {
  origin: 'https://fmaffezzoni.github.io',
  basePath: '/federico-maffezzoni',
  customDomain: 'https://federicomaffezzoni.it',
  phoneDisplay: '0372 183 5363',
  phoneTel: '+3903721835363',
  email: 'dott.federicomaffezzoni@gmail.com',
  miodottore: 'https://www.miodottore.it/profilo/federico-maffezzoni',
  ogImagePath: '/images/federico.png',
  cremonaAddress: 'Via Fabio Filzi, 51, Cremona 26100',
  bresciaAddress: 'Via Guglielmo Oberdan 126, Brescia 25128 (Poliambulatorio Oberdan)',
  googleVerification: 'WmHwpOeC3_lMzNVwkcen_Op6eiTTpMDcXUhbZQ6TCFA',
  bingVerification: 'INSERT_BING_VERIFICATION_CODE'
};

export function siteUrl() {
  return (SITE.customDomain || `${SITE.origin}${SITE.basePath}`).replace(/\/$/, '');
}

export function absoluteUrl(path = '/') {
  const base = siteUrl();
  if (!path || path === '/') return `${base}/`;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export function absoluteAsset(path) {
  if (!path) return absoluteUrl(SITE.ogImagePath);
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${siteUrl()}${clean}`;
}

export const PUBLIC_PATHS = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/about', changefreq: 'monthly', priority: '0.9' },
  { path: '/services', changefreq: 'monthly', priority: '0.9' },
  { path: '/resources', changefreq: 'monthly', priority: '0.7' },
  { path: '/insights', changefreq: 'monthly', priority: '0.8' },
  { path: '/contact', changefreq: 'monthly', priority: '0.8' },
  { path: '/en', changefreq: 'weekly', priority: '0.9' }
];
