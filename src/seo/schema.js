import { absoluteAsset, absoluteUrl, SITE } from './config';

export function psychologistSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Psychologist',
    name: 'Dott. Federico Maffezzoni',
    alternateName: 'Dr. Federico Maffezzoni',
    description:
      'Psicologo e Psicoterapeuta a Cremona e Brescia. Consulenza psicologica e psicoterapia per adulti, adolescenti, coppie e genitori — anche online. English speaking psychologist in Italy.',
    image: absoluteAsset(SITE.ogImagePath),
    url: absoluteUrl('/'),
    telephone: SITE.phoneTel,
    email: SITE.email,
    priceRange: '€€',
    availableLanguage: ['Italian', 'English', 'it', 'en'],
    sameAs: [SITE.miodottore],
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Via Fabio Filzi, 51',
        addressLocality: 'Cremona',
        postalCode: '26100',
        addressRegion: 'Lombardia',
        addressCountry: 'IT'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Via Guglielmo Oberdan 126, Poliambulatorio Oberdan',
        addressLocality: 'Brescia',
        postalCode: '25128',
        addressRegion: 'Lombardia',
        addressCountry: 'IT'
      }
    ],
    areaServed: [
      { '@type': 'City', name: 'Cremona' },
      { '@type': 'City', name: 'Brescia' },
      { '@type': 'Country', name: 'Italy' }
    ],
    hasOfferCatalog: {
      '@type': 'OfferCatalog',
      name: 'Servizi Psicologici',
      itemListElement: [
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Consulenza Psicologica' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Psicoterapia' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Consulenza psicologica online' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Psicologo online' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Terapia di Coppia' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sostegno psicologico per adolescenti' } },
        { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Sostegno alla genitorialità' } }
      ]
    }
  };
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    '@id': `${absoluteUrl('/')}#localbusiness`,
    name: 'Dott. Federico Maffezzoni - Psicologo Cremona e Brescia',
    description:
      'Psicologo e Psicoterapeuta. Riceve a Cremona e Brescia (Poliambulatorio Oberdan). Consulenza psicologica online disponibile. English speaking psychologist in Italy.',
    url: absoluteUrl('/'),
    telephone: SITE.phoneTel,
    email: SITE.email,
    image: absoluteAsset(SITE.ogImagePath),
    priceRange: '€€',
    openingHours: 'Mo-Fr 09:00-19:00',
    address: [
      {
        '@type': 'PostalAddress',
        streetAddress: 'Via Fabio Filzi, 51',
        addressLocality: 'Cremona',
        postalCode: '26100',
        addressRegion: 'Lombardia',
        addressCountry: 'IT'
      },
      {
        '@type': 'PostalAddress',
        streetAddress: 'Via Guglielmo Oberdan 126, Poliambulatorio Oberdan',
        addressLocality: 'Brescia',
        postalCode: '25128',
        addressRegion: 'Lombardia',
        addressCountry: 'IT'
      }
    ],
    areaServed: ['Cremona', 'Brescia', 'Lombardia', 'Italia']
  };
}

export function faqSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((q) => ({
      '@type': 'Question',
      name: q.q,
      acceptedAnswer: { '@type': 'Answer', text: q.a }
    }))
  };
}

export function breadcrumbSchema(crumbs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path)
    }))
  };
}

export const DEFAULT_FAQS = {
  it: [
    {
      q: 'Come prenotare una consulenza psicologica a Cremona o Brescia?',
      a: 'È possibile prenotare tramite MioDottore o contattando il Dott. Federico Maffezzoni via telefono o email. Riceve a Cremona e al Poliambulatorio Oberdan di Brescia, e offre anche consulenza psicologica online.'
    },
    {
      q: 'Offrite consulenza psicologica online?',
      a: 'Sì. Il Dott. Maffezzoni offre consulenza psicologica online e psicoterapia online per adulti, adolescenti, coppie e genitori, in italiano e in inglese, in tutta Italia.'
    },
    {
      q: 'Il Dott. Maffezzoni parla inglese?',
      a: 'Sì. Dr. Federico Maffezzoni is an English speaking psychologist in Italy and an Italian psychologist offering sessions in English for expats and international clients, in person and online.'
    }
  ],
  en: [
    {
      q: 'How can I book a psychological consultation in Cremona or Brescia?',
      a: 'You can book via MioDottore or contact Dr. Federico Maffezzoni by phone or email. He sees clients in Cremona and at Poliambulatorio Oberdan in Brescia, and also offers online psychological counselling.'
    },
    {
      q: 'Do you offer online psychological counselling?',
      a: 'Yes. Online psychological counselling and online psychotherapy are available for adults, adolescents, couples and parents, in Italian and English, across Italy.'
    },
    {
      q: 'Is Dr. Maffezzoni an English speaking psychologist in Italy?',
      a: 'Yes. He is an Italian psychologist and English speaking psychologist in Italy, offering in-person and online therapy for expats and international clients.'
    }
  ]
};
