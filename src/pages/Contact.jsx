import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import BookButton from '../components/BookButton';
import Breadcrumbs from '../components/Breadcrumbs';
import SeoHead from '../seo/SeoHead';
import { useLanguage } from '../i18n/LanguageContext';

export default function Contact() {
  const { t, lang } = useLanguage();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: t.nav.contact, path: '/contact' }
  ];

  return (
    <>
      <SeoHead
        title={t.seo?.contactTitle || t.contact.title}
        description={t.seo?.contactDesc || t.contact.subtitle}
        path="/contact"
        crumbs={crumbs}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero title={t.contact.title} subtitle={t.contact.subtitle} />
      <section className="section-space pt-0">
        <div className="container-page grid gap-8 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-6">
            {t.contact.locations.map((loc) => (
              <article key={loc.name} className="surface p-6">
                <h2 className="display text-2xl text-mist-900">{loc.name}</h2>
                <div className="mt-4 space-y-3 text-mist-700">
                  <div className="flex gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" />
                    <span>{loc.address}</span>
                  </div>
                  <div className="flex gap-2">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-mist-500" />
                    <a href={`tel:+39${loc.phone.replace(/\s/g, '')}`} className="hover:text-mist-900">
                      {loc.phone}
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="space-y-6">
            <div className="surface p-6">
              <h2 className="display text-2xl text-mist-900">{t.cta.book}</h2>
              <p className="mt-3 text-mist-700">{t.contact.bookOnline}</p>
              <div className="mt-6 space-y-3">
                <BookButton fullWidth />
                <a href={`mailto:${t.contact.email}`} className="btn-secondary w-full">
                  <Mail className="h-4 w-4" />
                  {t.cta.email}
                </a>
                <a href={`tel:+39${t.contact.phone.replace(/\s/g, '')}`} className="btn-secondary w-full">
                  <Phone className="h-4 w-4" />
                  {t.contact.phone}
                </a>
              </div>
              <p className="mt-4 break-all text-sm text-mist-600">{t.contact.email}</p>
              <p className="mt-4 text-sm text-mist-700">
                <Link to="/services" className="font-semibold underline">
                  {lang === 'en'
                    ? 'See psychology services in Cremona and Brescia'
                    : 'Scopri i servizi di psicologia a Cremona e Brescia'}
                </Link>
              </p>
            </div>

            <div className="surface p-6">
              <h2 className="display text-2xl text-mist-900">{t.contact.paymentTitle}</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {t.contact.payments.map((method) => (
                  <span key={method} className="rounded-full bg-mist-100 px-3 py-1.5 text-sm text-mist-800">
                    {method}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
