import { FileDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import PhotoPlaceholder from '../components/PhotoPlaceholder';
import BookButton from '../components/BookButton';
import Breadcrumbs from '../components/Breadcrumbs';
import SeoHead from '../seo/SeoHead';
import { useLanguage } from '../i18n/LanguageContext';
import { assetUrl } from '../utils/assets';

export default function About() {
  const { t, lang } = useLanguage();
  const cvUrl = assetUrl(t.meta?.cvUrl || '/CV_Federico_Maffezzoni.pdf');
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: t.nav.about, path: '/about' }
  ];

  return (
    <>
      <SeoHead
        title={t.seo?.aboutTitle || t.about.title}
        description={t.seo?.aboutDesc || t.about.intro}
        path="/about"
        crumbs={crumbs}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero title={t.seo?.aboutH1 || t.about.title} subtitle={t.about.intro} />
      <section className="section-space pt-0">
        <div className="container-page grid gap-10 lg:grid-cols-[0.9fr_1.3fr]">
          <div className="space-y-6">
            <PhotoPlaceholder
              src={t.meta?.photoAbout || '/images/Fede.webp'}
              alt={t.seo?.altAbout || t.brand}
              label={t.cta.photoHint}
              className="shadow-soft"
            />
            <div className="surface space-y-3 p-5">
              <p className="text-sm text-mist-600">{t.home.availability}</p>
              <BookButton fullWidth />
              <a
                href={cvUrl}
                download
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary w-full"
              >
                <FileDown className="h-4 w-4" />
                {t.cta.downloadCv}
              </a>
            </div>
          </div>

          <div>
            <div className="space-y-5 text-base leading-relaxed text-mist-800 md:text-lg">
              {t.about.bio.map((paragraph) => (
                <p key={paragraph.slice(0, 40)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 grid gap-6 md:grid-cols-2">
              <div className="surface p-6">
                <h2 className="display text-2xl text-mist-900">{t.about.educationTitle}</h2>
                <ul className="mt-5 space-y-4">
                  {t.about.education.map((item) => (
                    <li key={`${item.place}-${item.detail}`}>
                      <div className="font-semibold text-mist-900">{item.place}</div>
                      <div className="mt-1 text-sm text-mist-600">{item.detail}</div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <div className="surface p-6">
                  <h2 className="display text-2xl text-mist-900">{t.about.languagesTitle}</h2>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {t.about.languages.map((lang) => (
                      <span
                        key={lang}
                        className="rounded-full bg-mist-100 px-3 py-1.5 text-sm font-medium text-mist-800"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="surface p-6">
                  <h2 className="display text-2xl text-mist-900">{t.about.awardsTitle}</h2>
                  <ul className="mt-4 space-y-3 text-sm leading-relaxed text-mist-700">
                    {t.about.awards.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container-page mt-16 md:mt-20">
          <div className="soft-divider mb-12" />
          <div className="max-w-4xl">
            <h2 className="display text-3xl text-mist-900 md:text-4xl">{t.approach.title}</h2>
            <p className="mt-3 text-lg text-mist-600">{t.approach.subtitle}</p>
            <p className="mt-6 text-lg leading-relaxed text-mist-800 md:text-xl">{t.approach.body}</p>

            <h3 className="display mt-12 text-2xl text-mist-900 md:text-3xl">{t.approach.areasTitle}</h3>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {t.approach.areas.map((area) => (
                <div
                  key={area}
                  className="rounded-2xl border border-mist-200 bg-white/55 px-5 py-4 text-mist-800 backdrop-blur"
                >
                  {area}
                </div>
              ))}
            </div>
            <p className="mt-10 text-mist-700">
              <Link to="/services" className="font-semibold text-mist-800 underline">
                {lang === 'en'
                  ? 'Explore psychology services in Cremona and Brescia'
                  : 'Scopri i servizi di psicologia a Cremona e Brescia'}
              </Link>
              {' · '}
              <Link to="/contact" className="font-semibold text-mist-800 underline">
                {t.cta.contact}
              </Link>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
