import { useEffect, useMemo, useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';

const VISIBLE = {
  base: 1,
  sm: 2,
  lg: 4
};

const AUTO_MS = 4500;

function useVisibleCount() {
  const [count, setCount] = useState(VISIBLE.lg);

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      if (w < 640) setCount(VISIBLE.base);
      else if (w < 1024) setCount(VISIBLE.sm);
      else setCount(VISIBLE.lg);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  return count;
}

export default function Testimonials() {
  const { t } = useLanguage();
  const items = t.testimonials?.items || [];
  const visible = useVisibleCount();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const maxIndex = useMemo(
    () => Math.max(0, items.length - visible),
    [items.length, visible]
  );

  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    if (maxIndex === 0 || paused) return undefined;

    const reduceMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return undefined;

    const id = window.setInterval(() => {
      setIndex((i) => (i >= maxIndex ? 0 : i + 1));
    }, AUTO_MS);

    return () => window.clearInterval(id);
  }, [maxIndex, paused]);

  if (!items.length) return null;

  const stepPct = 100 / visible;

  return (
    <section className="section-space border-t border-mist-200/60 bg-white/35 pb-12 pt-14 md:pb-16 md:pt-20">
      <div className="container-page">
        <div className="mb-8">
          <p className="eyebrow mb-3">{t.testimonials.sourceLabel}</p>
          <h2 className="display text-3xl text-mist-900 md:text-4xl">{t.testimonials.title}</h2>
          <p className="mt-2 max-w-xl text-mist-600">{t.testimonials.subtitle}</p>
        </div>

        <div
          className="overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}
        >
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${index * stepPct}%)` }}
          >
            {items.map((item) => (
              <div
                key={item.id}
                className="shrink-0 px-1.5 sm:px-2"
                style={{ width: `${stepPct}%` }}
              >
                <figure className="flex aspect-[5/4] w-full items-center justify-center overflow-hidden rounded-2xl border border-mist-200/80 bg-white shadow-soft sm:aspect-[4/3]">
                  <img
                    src={item.image}
                    alt={item.alt}
                    width={800}
                    height={640}
                    className="max-h-full max-w-full object-contain object-center"
                    loading="lazy"
                    decoding="async"
                  />
                </figure>
              </div>
            ))}
          </div>
        </div>

        {maxIndex > 0 && (
          <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition ${
                  i === index ? 'w-6 bg-mist-700' : 'w-1.5 bg-mist-300'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
