import { Link } from 'react-router-dom';
import PageHero from '../components/PageHero';
import Breadcrumbs from '../components/Breadcrumbs';
import SeoHead from '../seo/SeoHead';
import { useLanguage } from '../i18n/LanguageContext';

export default function Insights() {
  const { t, lang } = useLanguage();
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: lang === 'en' ? 'Insights' : 'Approfondimenti', path: '/insights' }
  ];
  const posts = t.insights?.posts || [];

  return (
    <>
      <SeoHead
        title={t.seo?.insightsTitle || t.insights?.title}
        description={t.seo?.insightsDesc || t.insights?.subtitle}
        path="/insights"
        crumbs={crumbs}
      />
      <Breadcrumbs items={crumbs} />
      <PageHero title={t.insights.title} subtitle={t.insights.subtitle} />
      <section className="section-space pt-0">
        <div className="container-page max-w-4xl space-y-10">
          {posts.map((post) => (
            <article key={post.title} className="surface p-6 md:p-8" id={post.id}>
              <h2 className="display text-2xl text-mist-900 md:text-3xl">{post.title}</h2>
              {post.paragraphs.map((p) => (
                <p key={p.slice(0, 40)} className="mt-4 leading-relaxed text-mist-700">
                  {p}
                </p>
              ))}
            </article>
          ))}
          <p className="text-mist-700">
            <Link to="/contact" className="font-semibold text-mist-800 underline">
              {t.cta.book}
            </Link>
            {' · '}
            <Link to="/services" className="font-semibold text-mist-800 underline">
              {t.nav.services}
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
