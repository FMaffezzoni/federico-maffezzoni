import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { absoluteAsset, absoluteUrl, SITE } from './config';
import { breadcrumbSchema, faqSchema, localBusinessSchema, psychologistSchema } from './schema';

function upsertMeta(selector, attrs) {
  let el = document.head.querySelector(selector);
  if (!el) {
    el = document.createElement(attrs.property ? 'meta' : 'meta');
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => {
    if (v == null) el.removeAttribute(k);
    else el.setAttribute(k, v);
  });
  return el;
}

function upsertLink(rel, href, extra = {}) {
  const sel = extra.hreflang
    ? `link[rel="${rel}"][hreflang="${extra.hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`;
  let el = document.head.querySelector(sel);
  if (!el) {
    el = document.createElement('link');
    document.head.appendChild(el);
  }
  el.setAttribute('rel', rel);
  el.setAttribute('href', href);
  Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v));
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export default function SeoHead({
  title,
  description,
  path,
  image,
  type = 'website',
  crumbs,
  faqs
}) {
  const { lang } = useLanguage();
  const location = useLocation();
  const canonicalPath = path ?? location.pathname;
  const url = absoluteUrl(canonicalPath === '/' ? '/' : canonicalPath);
  const ogImage = absoluteAsset(image || SITE.ogImagePath);
  const fullTitle = title;

  useEffect(() => {
    document.title = fullTitle;
    document.documentElement.lang = lang;

    upsertMeta('meta[name="description"]', { name: 'description', content: description });
    upsertMeta('meta[name="robots"]', { name: 'robots', content: 'index, follow' });
    upsertMeta('meta[name="author"]', { name: 'author', content: 'Dott. Federico Maffezzoni' });
    upsertMeta('meta[name="geo.region"]', { name: 'geo.region', content: 'IT-25' });
    upsertMeta('meta[name="geo.placename"]', { name: 'geo.placename', content: 'Cremona, Brescia' });
    upsertMeta('meta[name="keywords"]', {
      name: 'keywords',
      content:
        'Psicologo Brescia, Psicologo Cremona, Psicoterapeuta Brescia, Psicoterapeuta Cremona, Consulenza psicologica online, Psicologo online, English speaking psychologist Italy, Italian psychologist, Poliambulatorio Oberdan Brescia'
    });

    upsertLink('canonical', url);

    const itHref = absoluteUrl(canonicalPath === '/en' ? '/' : canonicalPath);
    const enHref = absoluteUrl('/en');
    upsertLink('alternate', itHref, { hreflang: 'it' });
    upsertLink('alternate', enHref, { hreflang: 'en' });
    upsertLink('alternate', itHref, { hreflang: 'x-default' });

    upsertMeta('meta[property="og:title"]', { property: 'og:title', content: fullTitle });
    upsertMeta('meta[property="og:description"]', { property: 'og:description', content: description });
    upsertMeta('meta[property="og:image"]', { property: 'og:image', content: ogImage });
    upsertMeta('meta[property="og:url"]', { property: 'og:url', content: url });
    upsertMeta('meta[property="og:type"]', { property: 'og:type', content: type });
    upsertMeta('meta[property="og:locale"]', { property: 'og:locale', content: lang === 'en' ? 'en_GB' : 'it_IT' });
    upsertMeta('meta[property="og:locale:alternate"]', {
      property: 'og:locale:alternate',
      content: lang === 'en' ? 'it_IT' : 'en_GB'
    });
    upsertMeta('meta[property="og:site_name"]', {
      property: 'og:site_name',
      content: 'Dott. Federico Maffezzoni'
    });

    upsertMeta('meta[name="twitter:card"]', { name: 'twitter:card', content: 'summary_large_image' });
    upsertMeta('meta[name="twitter:title"]', { name: 'twitter:title', content: fullTitle });
    upsertMeta('meta[name="twitter:description"]', { name: 'twitter:description', content: description });
    upsertMeta('meta[name="twitter:image"]', { name: 'twitter:image', content: ogImage });

    upsertJsonLd('ld-psychologist', psychologistSchema());
    upsertJsonLd('ld-localbusiness', localBusinessSchema());
    if (faqs?.length) upsertJsonLd('ld-faq', faqSchema(faqs));
    else {
      document.getElementById('ld-faq')?.remove();
    }
    if (crumbs?.length) upsertJsonLd('ld-breadcrumb', breadcrumbSchema(crumbs));
    else {
      document.getElementById('ld-breadcrumb')?.remove();
    }
  }, [fullTitle, description, url, ogImage, lang, type, canonicalPath, crumbs, faqs]);

  return null;
}
