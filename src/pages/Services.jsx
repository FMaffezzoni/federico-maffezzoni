import PageHero from '../components/PageHero';
import { useLanguage } from '../i18n/LanguageContext';

export default function Services() {
  const { t } = useLanguage();
  const sections = t.conditions.sections || [];
  const flatItems = t.conditions.items || [];

  return (
    <>
      <PageHero title={t.services.title} subtitle={t.services.subtitle} />
      <section className="section-space pt-0">
        <div className="container-page">
          <p className="mb-8 max-w-3xl text-mist-600">{t.services.note}</p>
          <div className="overflow-hidden rounded-[1.75rem] border border-mist-200 bg-white/60 backdrop-blur">
            <ul className="divide-y divide-mist-100">
              {t.services.items.map((item) => (
                <li
                  key={item.name}
                  className="flex flex-col gap-1 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6 md:px-7"
                >
                  <span className="font-medium text-mist-900">{item.name}</span>
                  <span className="shrink-0 text-sm font-semibold text-mist-700 sm:text-base">{item.price}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="soft-divider my-14 md:my-16" />

          <div>
            <h2 className="display text-3xl text-mist-900 md:text-4xl">{t.conditions.title}</h2>
            <p className="mt-3 max-w-3xl text-lg text-mist-600">{t.conditions.subtitle}</p>

            <div className="mt-10 space-y-14">
              {sections.length > 0
                ? sections.map((section) => (
                    <div key={section.id || section.title}>
                      <h3 className="display text-2xl text-mist-900 md:text-3xl">{section.title}</h3>
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
          </div>
        </div>
      </section>
    </>
  );
}
