import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, HeartHandshake, Leaf, Waves } from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';
import PhotoPlaceholder from '../components/PhotoPlaceholder';
import BookButton from '../components/BookButton';
import FaqSection from '../components/FaqSection';
import SeoHead from '../seo/SeoHead';
import { DEFAULT_FAQS } from '../seo/schema';

const icons = [HeartHandshake, Leaf, Waves];

export default function Home() {
  const { t, lang } = useLanguage();
  const location = useLocation();
  const isEn = location.pathname === '/en' || lang === 'en';
  const faqs = DEFAULT_FAQS[isEn ? 'en' : 'it'];
  const seo = t.seo;

  return (
    <>
      <SeoHead
        title={isEn ? seo.enTitle : seo.homeTitle}
        description={isEn ? seo.enDesc : seo.homeDesc}
        path={location.pathname === '/en' ? '/en' : '/'}
        faqs={faqs}
        crumbs={[{ name: 'Home', path: '/' }]}
      />
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-accent-soft/70 blur-3xl" />
          <div className="absolute -right-16 bottom-0 h-80 w-80 rounded-full bg-mist-200/60 blur-3xl" />
        </div>

        <div className="container-page relative grid min-h-[78vh] items-center gap-12 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-24">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
            <p className="eyebrow mb-5">{t.home.eyebrow}</p>
            <h1 className="display text-4xl leading-[1.08] text-slateink-900 sm:text-5xl lg:text-[2.85rem] lg:leading-[1.12]">
              {isEn ? seo.enH1 : seo.homeH1}
            </h1>
            <p className="mt-3 text-lg font-medium text-mist-700 md:text-xl">{t.role}</p>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-mist-800 md:text-xl">{t.home.subtitle}</p>
            <p className="mt-4 max-w-xl text-base text-mist-600">{t.home.availability}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <BookButton />
              <Link to="/about" className="btn-secondary min-h-[44px]">
                {t.cta.learnMore}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.75, delay: 0.15 }}
            className="relative"
          >
            <PhotoPlaceholder
              src={t.meta?.photoHome || '/images/federico.webp'}
              alt={t.seo.altHome}
              label={t.cta.photoHint}
              className="shadow-soft"
              objectPosition="72% 32%"
              priority
            />
          </motion.div>
        </div>
      </section>

      <section className="section-space pt-4">
        <div className="container-page">
          <div className="soft-divider mb-14" />

          <div className="surface mb-14 grid gap-8 p-7 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div>
              <h2 className="display text-2xl text-mist-900 md:text-3xl">{t.home.trustTitle}</h2>
              <p className="mt-4 leading-relaxed text-mist-700">{t.home.trustBody}</p>
            </div>
            <div className="flex flex-col justify-center gap-3">
              <BookButton fullWidth />
              <Link to="/contact" className="btn-secondary w-full min-h-[44px]">
                {t.cta.locations}
              </Link>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {t.home.pillars.map((item, index) => {
              const Icon = icons[index % icons.length];
              return (
                <motion.div
                  key={`${item.title}-${index}`}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                  className="rounded-[1.5rem] border border-mist-200/80 bg-white/50 p-6 backdrop-blur"
                >
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-mist-100 text-mist-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="display text-xl text-mist-900">{item.title}</h3>
                  <p className="mt-3 text-mist-700">{item.text}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section-space pt-0">
        <div className="container-page max-w-4xl space-y-12">
          {t.home.seoSections?.map((block) => (
            <div key={block.title}>
              <h2 className="display text-2xl text-mist-900 md:text-3xl">{block.title}</h2>
              {block.paragraphs.map((p) => (
                <p key={p.slice(0, 48)} className="mt-4 leading-relaxed text-mist-700">
                  {p}
                </p>
              ))}
            </div>
          ))}
          <p className="text-mist-700">
            <Link to="/services" className="font-semibold text-mist-800 underline">
              {t.home.seoCtaServices}
            </Link>
            {' · '}
            <Link to="/insights" className="font-semibold text-mist-800 underline">
              {t.home.seoCtaInsights}
            </Link>
            {' · '}
            <Link to="/contact" className="font-semibold text-mist-800 underline">
              {t.cta.contact}
            </Link>
          </p>
        </div>
      </section>

      <FaqSection title={t.home.faqTitle} items={faqs} />
    </>
  );
}
