import PageHero from '../components/PageHero';
import { useLanguage } from '../i18n/LanguageContext';

export default function Conditions() {
  const { t } = useLanguage();
  const sections = t.conditions.sections || [];
  const flatItems = t.conditions.items || [];

  return (
    <>
      <PageHero title={t.conditions.title} subtitle={t.conditions.subtitle} />
      <section className="section-space pt-0">
        <div className="container-page space-y-14">
          {sections.length > 0
            ? sections.map((section) => (
                <div key={section.id || section.title}>
                  <h2 className="display text-2xl text-mist-900 md:text-3xl">{section.title}</h2>
                  {section.intro && (
                    <p className="mt-4 max-w-3xl leading-relaxed text-mist-700">{section.intro}</p>
                  )}
                  <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {section.items.map((item) => (
                      <div
                        key={item}
                        className="rounded-2xl border border-mist-200/90 bg-white/55 px-4 py-4 text-sm leading-snug text-mist-800 backdrop-blur md:text-base"
                      >
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            : (
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {flatItems.map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-mist-200/90 bg-white/55 px-4 py-4 text-sm leading-snug text-mist-800 backdrop-blur md:text-base"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              )}
        </div>
      </section>
    </>
  );
}
