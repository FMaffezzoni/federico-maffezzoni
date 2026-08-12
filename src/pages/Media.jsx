import { ExternalLink, PlayCircle } from 'lucide-react';
import PageHero from '../components/PageHero';
import { useLanguage } from '../i18n/LanguageContext';

export default function Media() {
  const { t } = useLanguage();
  const items = t.media.items || [];

  return (
    <>
      <PageHero title={t.media.title} subtitle={t.media.subtitle} />
      <section className="section-space pt-0">
        <div className="container-page max-w-4xl space-y-4">
          {items.map((item) => (
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
      </section>
    </>
  );
}
