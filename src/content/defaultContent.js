import { translations } from '../i18n/translations.js';
import { MEDIA_LINKS, MIODOTTORE_URL } from '../constants/links.js';
import { assetUrl } from '../utils/assets.js';

const uid = () => `id_${Math.random().toString(36).slice(2, 10)}`;

/** Build bilingual CMS document from current static site content */
export function buildDefaultContent() {
  const itServices = translations.it.services.items;
  const enServices = translations.en.services.items;

  return {
    version: 1,
    updatedAt: new Date().toISOString(),
    profile: {
      brand: { it: translations.it.brand, en: translations.en.brand },
      role: { it: translations.it.role, en: translations.en.role },
      email: translations.it.contact.email,
      phone: translations.it.contact.phone,
      bookingUrl: MIODOTTORE_URL,
      photoHome: '/images/federico.png',
      photoAbout: '/images/Fede.png',
      cvUrl: '/CV_Federico_Maffezzoni.pdf'
    },
    nav: {
      about: { it: translations.it.nav.about, en: translations.en.nav.about },
      services: { it: translations.it.nav.services, en: translations.en.nav.services },
      resources: { it: translations.it.nav.resources, en: translations.en.nav.resources },
      insights: { it: translations.it.nav.insights, en: translations.en.nav.insights },
      contact: { it: translations.it.nav.contact, en: translations.en.nav.contact }
    },
    cta: {
      book: { it: translations.it.cta.book, en: translations.en.cta.book },
      bookMioDottore: { it: translations.it.cta.bookMioDottore, en: translations.en.cta.bookMioDottore },
      contact: { it: translations.it.cta.contact, en: translations.en.cta.contact },
      email: { it: translations.it.cta.email, en: translations.en.cta.email },
      learnMore: { it: translations.it.cta.learnMore, en: translations.en.cta.learnMore },
      locations: { it: translations.it.cta.locations, en: translations.en.cta.locations },
      online: { it: translations.it.cta.online, en: translations.en.cta.online },
      watch: { it: translations.it.cta.watch, en: translations.en.cta.watch },
      photoHint: { it: translations.it.cta.photoHint, en: translations.en.cta.photoHint },
      downloadCv: { it: translations.it.cta.downloadCv, en: translations.en.cta.downloadCv }
    },
    home: {
      eyebrow: { it: translations.it.home.eyebrow, en: translations.en.home.eyebrow },
      title: { it: translations.it.home.title, en: translations.en.home.title },
      subtitle: { it: translations.it.home.subtitle, en: translations.en.home.subtitle },
      availability: { it: translations.it.home.availability, en: translations.en.home.availability },
      trustTitle: { it: translations.it.home.trustTitle, en: translations.en.home.trustTitle },
      trustBody: { it: translations.it.home.trustBody, en: translations.en.home.trustBody },
      pillars: translations.it.home.pillars.map((p, i) => ({
        id: uid(),
        title: { it: p.title, en: translations.en.home.pillars[i].title },
        text: { it: p.text, en: translations.en.home.pillars[i].text }
      }))
    },
    about: {
      title: { it: translations.it.about.title, en: translations.en.about.title },
      intro: { it: translations.it.about.intro, en: translations.en.about.intro },
      bio: translations.it.about.bio.map((p, i) => ({
        id: uid(),
        it: p,
        en: translations.en.about.bio[i] || p
      })),
      educationTitle: { it: translations.it.about.educationTitle, en: translations.en.about.educationTitle },
      education: translations.it.about.education.map((e, i) => ({
        id: uid(),
        place: { it: e.place, en: translations.en.about.education[i].place },
        detail: { it: e.detail, en: translations.en.about.education[i].detail }
      })),
      languagesTitle: { it: translations.it.about.languagesTitle, en: translations.en.about.languagesTitle },
      languages: translations.it.about.languages.map((l, i) => ({
        id: uid(),
        it: l,
        en: translations.en.about.languages[i] || l
      })),
      awardsTitle: { it: translations.it.about.awardsTitle, en: translations.en.about.awardsTitle },
      awards: translations.it.about.awards.map((a, i) => ({
        id: uid(),
        it: a,
        en: translations.en.about.awards[i] || a
      }))
    },
    approach: {
      title: { it: translations.it.approach.title, en: translations.en.approach.title },
      subtitle: { it: translations.it.approach.subtitle, en: translations.en.approach.subtitle },
      body: { it: translations.it.approach.body, en: translations.en.approach.body },
      areasTitle: { it: translations.it.approach.areasTitle, en: translations.en.approach.areasTitle },
      areas: translations.it.approach.areas.map((a, i) => ({
        id: uid(),
        it: a,
        en: translations.en.approach.areas[i] || a
      }))
    },
    services: {
      title: { it: translations.it.services.title, en: translations.en.services.title },
      subtitle: { it: translations.it.services.subtitle, en: translations.en.services.subtitle },
      note: { it: translations.it.services.note, en: translations.en.services.note },
      items: itServices.map((item, i) => ({
        id: uid(),
        name: { it: item.name, en: enServices[i]?.name || item.name },
        price: item.price,
        active: true
      }))
    },
    conditions: {
      title: { it: translations.it.conditions.title, en: translations.en.conditions.title },
      subtitle: { it: translations.it.conditions.subtitle, en: translations.en.conditions.subtitle },
      sections: (translations.it.conditions.sections || []).map((section, si) => ({
        id: uid(),
        title: {
          it: section.title,
          en: translations.en.conditions.sections[si]?.title || section.title
        },
        intro: {
          it: section.intro,
          en: translations.en.conditions.sections[si]?.intro || section.intro
        },
        items: (section.items || []).map((item, ii) => ({
          id: uid(),
          it: item,
          en: translations.en.conditions.sections[si]?.items?.[ii] || item
        }))
      })),
      // legacy flat list kept for older admin drafts / fallbacks
      items: (translations.it.conditions.sections || []).flatMap((section, si) =>
        (section.items || []).map((item, ii) => ({
          id: uid(),
          it: item,
          en: translations.en.conditions.sections[si]?.items?.[ii] || item
        }))
      )
    },
    media: {
      title: { it: translations.it.media.title, en: translations.en.media.title },
      subtitle: { it: translations.it.media.subtitle, en: translations.en.media.subtitle },
      source: { it: translations.it.media.source, en: translations.en.media.source },
      items: MEDIA_LINKS.map((m) => ({
        id: m.id,
        url: m.url,
        title: { it: m.it, en: m.en },
        active: true
      }))
    },
    resources: {
      title: { it: translations.it.resources.title, en: translations.en.resources.title },
      subtitle: { it: translations.it.resources.subtitle, en: translations.en.resources.subtitle }
    },
    publications: {
      title: { it: translations.it.publications.title, en: translations.en.publications.title },
      items: translations.it.publications.items.map((citation, i) => ({
        id: uid(),
        citation,
        year: '',
        link: '',
        active: true
      }))
    },
    contact: {
      title: { it: translations.it.contact.title, en: translations.en.contact.title },
      subtitle: { it: translations.it.contact.subtitle, en: translations.en.contact.subtitle },
      bookOnline: { it: translations.it.contact.bookOnline, en: translations.en.contact.bookOnline },
      paymentTitle: { it: translations.it.contact.paymentTitle, en: translations.en.contact.paymentTitle },
      payments: translations.it.contact.payments.map((p, i) => ({
        id: uid(),
        it: p,
        en: translations.en.contact.payments[i] || p
      })),
      locations: translations.it.contact.locations.map((loc, i) => ({
        id: uid(),
        name: { it: loc.name, en: translations.en.contact.locations[i].name },
        address: { it: loc.address, en: translations.en.contact.locations[i].address },
        phone: loc.phone
      }))
    },
    testimonials: {
      title: {
        it: 'Cosa dicono i pazienti',
        en: 'What patients say'
      },
      subtitle: {
        it: 'Recensioni verificate su MioDottore',
        en: 'Verified reviews on MioDottore'
      },
      sourceLabel: {
        it: 'Fonte: MioDottore',
        en: 'Source: MioDottore'
      },
      items: [
        {
          id: 'review_cl',
          image: '/images/testimonials/review-cl.png',
          alt: {
            it: 'Recensione MioDottore — Psicologo Cremona Dott. Federico Maffezzoni',
            en: 'MioDottore review — Psychologist Cremona Dr. Federico Maffezzoni'
          },
          active: true
        },
        {
          id: 'review_sf',
          image: '/images/testimonials/review-sf.png',
          alt: {
            it: 'Recensione MioDottore — Psicoterapeuta Brescia Dott. Federico Maffezzoni',
            en: 'MioDottore review — Psychotherapist Brescia Dr. Federico Maffezzoni'
          },
          active: true
        },
        {
          id: 'review_carolina',
          image: '/images/testimonials/review-carolina.png',
          alt: {
            it: 'Recensione MioDottore — Consulenza psicologica online Dott. Maffezzoni',
            en: 'MioDottore review — Online psychological counselling Dr. Maffezzoni'
          },
          active: true
        },
        {
          id: 'review_andrea',
          image: '/images/testimonials/review-andrea.png',
          alt: {
            it: 'Recensione MioDottore — Psicologo Brescia Poliambulatorio Oberdan',
            en: 'MioDottore review — Psychologist Brescia Poliambulatorio Oberdan'
          },
          active: true
        },
        {
          id: 'review_zc',
          image: '/images/testimonials/review-zc.png',
          alt: {
            it: 'Recensione MioDottore — Psicoterapeuta Cremona Dott. Federico Maffezzoni',
            en: 'MioDottore review — Psychotherapist Cremona Dr. Federico Maffezzoni'
          },
          active: true
        },
        {
          id: 'review_ben',
          image: '/images/testimonials/review-ben.png',
          alt: {
            it: 'Recensione MioDottore — English speaking psychologist Italy',
            en: 'MioDottore review — English speaking psychologist Italy'
          },
          active: true
        }
      ]
    },
    footer: {
      rights: { it: translations.it.footer.rights, en: translations.en.footer.rights },
      note: { it: translations.it.footer.note, en: translations.en.footer.note }
    }
  };
}

/** Flatten CMS content into the shape pages currently expect for one language */
export function contentToLocale(content, lang = 'it') {
  const L = (obj) => (obj && typeof obj === 'object' ? obj[lang] || obj.it || '' : obj || '');
  const extra = translations[lang] || translations.it;

  return {
    brand: L(content.profile.brand),
    role: L(content.profile.role),
    nav: Object.fromEntries(Object.entries(content.nav || {}).map(([k, v]) => [k, L(v)])),
    cta: Object.fromEntries(Object.entries(content.cta || {}).map(([k, v]) => [k, L(v)])),
    home: {
      eyebrow: L(content.home.eyebrow),
      title: L(content.home.title),
      subtitle: L(content.home.subtitle),
      availability: L(content.home.availability),
      trustTitle: L(content.home.trustTitle),
      trustBody: L(content.home.trustBody),
      pillars: (content.home.pillars || []).map((p) => ({
        title: L(p.title),
        text: L(p.text)
      })),
      faqTitle: extra.home.faqTitle,
      seoCtaServices: extra.home.seoCtaServices,
      seoCtaInsights: extra.home.seoCtaInsights,
      seoSections: extra.home.seoSections
    },
    about: {
      title: L(content.about.title),
      intro: L(content.about.intro),
      bio: (content.about.bio || []).map((b) => L(b)),
      educationTitle: L(content.about.educationTitle),
      education: (content.about.education || []).map((e) => ({
        place: L(e.place),
        detail: L(e.detail)
      })),
      languagesTitle: L(content.about.languagesTitle),
      languages: (content.about.languages || []).map((l) => L(l)),
      awardsTitle: L(content.about.awardsTitle),
      awards: (content.about.awards || []).map((a) => L(a))
    },
    approach: {
      title: L(content.approach.title),
      subtitle: L(content.approach.subtitle),
      body: L(content.approach.body),
      areasTitle: L(content.approach.areasTitle),
      areas: (content.approach.areas || []).map((a) => L(a))
    },
    services: {
      title: L(content.services.title),
      subtitle: L(content.services.subtitle),
      note: L(content.services.note),
      items: (content.services.items || [])
        .filter((s) => s.active !== false)
        .map((s) => ({ name: L(s.name), price: s.price })),
      catalog: extra.services.catalog
    },
    conditions: {
      title: L(content.conditions.title),
      subtitle: L(content.conditions.subtitle),
      sections: (content.conditions.sections || []).map((section) => ({
        id: section.id,
        title: L(section.title),
        intro: L(section.intro),
        items: (section.items || []).map((item) => L(item))
      })),
      items: (content.conditions.sections || []).length
        ? (content.conditions.sections || []).flatMap((section) =>
            (section.items || []).map((item) => L(item))
          )
        : (content.conditions.items || []).map((c) => L(c))
    },
    media: {
      title: L(content.media.title),
      subtitle: L(content.media.subtitle),
      source: L(content.media.source),
      items: (content.media.items || [])
        .filter((m) => m.active !== false)
        .map((m) => ({ id: m.id, url: m.url, title: L(m.title) }))
    },
    resources: {
      title:
        L(content.resources?.title) ||
        (lang === 'en' ? 'Media & Research' : 'Media e ricerca'),
      subtitle:
        L(content.resources?.subtitle) ||
        (lang === 'en'
          ? 'Television outreach, public communication, and scientific publications'
          : 'Interventi televisivi, divulgazione e pubblicazioni scientifiche')
    },
    publications: {
      title: L(content.publications.title),
      items: (content.publications.items || [])
        .filter((p) => p.active !== false)
        .map((p) => ({
          id: p.id,
          citation: p.citation,
          year: p.year || '',
          link: p.link || ''
        }))
    },
    contact: {
      title: L(content.contact.title),
      subtitle: L(content.contact.subtitle),
      email: content.profile.email,
      phone: content.profile.phone,
      bookOnline: L(content.contact.bookOnline),
      paymentTitle: L(content.contact.paymentTitle),
      payments: (content.contact.payments || []).map((p) => L(p)),
      locations: (content.contact.locations || []).map((loc) => ({
        name: L(loc.name),
        address: L(loc.address),
        phone: loc.phone || content.profile.phone
      }))
    },
    testimonials: {
      title: L(content.testimonials?.title) || (lang === 'en' ? 'What patients say' : 'Cosa dicono i pazienti'),
      subtitle:
        L(content.testimonials?.subtitle) ||
        (lang === 'en' ? 'Verified reviews on MioDottore' : 'Recensioni verificate su MioDottore'),
      sourceLabel:
        L(content.testimonials?.sourceLabel) ||
        (lang === 'en' ? 'Source: MioDottore' : 'Fonte: MioDottore'),
      items: (content.testimonials?.items || [])
        .filter((item) => item.active !== false && item.image)
        .map((item) => ({
          id: item.id,
          image: assetUrl(item.image),
          alt: L(item.alt) || 'MioDottore review'
        }))
    },
    footer: {
      rights: L(content.footer.rights),
      note: L(content.footer.note)
    },
    seo: extra.seo,
    insights: extra.insights,
    meta: {
      bookingUrl: content.profile.bookingUrl,
      photoHome: assetUrl(content.profile.photoHome),
      photoAbout: assetUrl(content.profile.photoAbout),
      cvUrl: assetUrl(content.profile.cvUrl || '/CV_Federico_Maffezzoni.pdf')
    }
  };
}

export { uid };
