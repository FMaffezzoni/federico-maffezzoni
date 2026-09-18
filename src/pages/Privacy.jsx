import PageHero from '../components/PageHero';
import Breadcrumbs from '../components/Breadcrumbs';
import SeoHead from '../seo/SeoHead';
import { useLanguage } from '../i18n/LanguageContext';
import { privacyNotice } from '../content/privacyNotice';

export default function Privacy() {
  const { t, lang } = useLanguage();
  const notice = privacyNotice[lang] || privacyNotice.it;
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: t.nav.privacy || notice.title, path: '/privacy' }
  ];

  return (
    <>
      <SeoHead
        title={t.seo?.privacyTitle || `${notice.title} | ${t.brand}`}
        description={t.seo?.privacyDesc || notice.subtitle}
        path="/privacy"
        crumbs={crumbs}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero title={notice.title} subtitle={notice.subtitle} />
      <section className="section-space pt-0">
        <div className="container-page max-w-3xl">
          <p className="text-sm font-medium text-mist-600">{notice.updated}</p>
          <div className="mt-10 space-y-10">
            {notice.sections.map((section) => (
              <article key={section.title}>
                <h2 className="display text-xl text-mist-900 md:text-2xl">{section.title}</h2>
                <div className="mt-4 space-y-4">
                  {section.paragraphs.map((p) => {
                    const isSubhead = /^\d+\.\d+\s/.test(p);
                    if (isSubhead) {
                      return (
                        <h3 key={p} className="pt-2 text-base font-semibold text-mist-800 md:text-lg">
                          {p}
                        </h3>
                      );
                    }
                    return (
                      <p
                        key={p.slice(0, 72)}
                        className="whitespace-pre-line leading-relaxed text-mist-700"
                      >
                        {p}
                      </p>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
