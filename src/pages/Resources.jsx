import { ExternalLink, PlayCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useLanguage } from '../i18n/LanguageContext';

export default function Resources() {
  const { t } = useLanguage();
  const mediaItems = t.media.items || [];
  const pubItems = t.publications.items || [];

  return (
    <>
      <PageHero title={t.resources.title} subtitle={t.resources.subtitle} />

      <section className="section-space pt-0">
        <div className="container-page max-w-4xl">
          <h2 className="display text-2xl text-mist-900 md:text-3xl">{t.media.title}</h2>
          <p className="mt-3 text-mist-600">{t.media.subtitle}</p>

          <div className="mt-8 space-y-4">
            {mediaItems.map((item) => (
              <a
                key={item.id || item.title}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex gap-4 rounded-[1.4rem] border border-mist-200 bg-white/55 p-5 backdrop-blur transition hover:border-mist-400 hover:bg-white/80"
              >
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-100 text-mist-700 transition group-hover:bg-mist-700 group-hover:text-white">
                  <PlayCircle className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="leading-relaxed text-mist-800">{item.title}</p>
                  <span className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-mist-600 group-hover:text-mist-800">
                    {t.cta.watch}
                    <ExternalLink className="h-3.5 w-3.5" />
                  </span>
                </div>
              </a>
            ))}
            <p className="pt-2 text-sm text-mist-500">{t.media.source}</p>
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="container-page max-w-4xl">
          <div className="soft-divider mb-12" />
          <h2 className="display text-2xl text-mist-900 md:text-3xl">{t.publications.title}</h2>

          <div className="mt-8 space-y-5">
            {pubItems.map((item, index) => {
              const citation = typeof item === 'string' ? item : item.citation;
              const year = typeof item === 'object' ? item.year : '';
              const link = typeof item === 'object' ? item.link : '';
              const key = (typeof item === 'object' && item.id) || citation?.slice(0, 48) || index;

              return (
                <article key={key} className="surface p-6 md:p-7">
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="text-xs font-semibold tracking-[0.16em] uppercase text-mist-500">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    {year && (
                      <span className="rounded-full bg-mist-100 px-2.5 py-0.5 text-xs font-semibold text-mist-700">
                        {year}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 leading-relaxed text-mist-800">{citation}</p>
                  {link && (
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-mist-600 hover:text-mist-800"
                    >
                      View
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
