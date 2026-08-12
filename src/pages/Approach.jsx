import PageHero from '../components/PageHero';
import { useLanguage } from '../i18n/LanguageContext';

export default function Approach() {
  const { t } = useLanguage();

  return (
    <>
      <PageHero title={t.approach.title} subtitle={t.approach.subtitle} />
      <section className="section-space pt-0">
        <div className="container-page max-w-4xl">
          <p className="text-lg leading-relaxed text-mist-800 md:text-xl">{t.approach.body}</p>

          <h2 className="display mt-12 text-2xl text-mist-900 md:text-3xl">{t.approach.areasTitle}</h2>
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
        </div>
      </section>
    </>
  );
}
