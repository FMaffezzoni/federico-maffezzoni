import { ExternalLink } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useLanguage } from '../i18n/LanguageContext';

export default function Publications() {
  const { t } = useLanguage();
  const items = t.publications.items || [];

  return (
    <>
      <PageHero title={t.publications.title} />
      <section className="section-space pt-0">
        <div className="container-page max-w-4xl space-y-5">
          {items.map((item, index) => {
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
      </section>
    </>
  );
}
