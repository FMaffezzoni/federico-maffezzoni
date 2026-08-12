import { motion } from 'framer-motion';

export default function PageHero({ eyebrow, title, subtitle }) {
  return (
    <section className="section-space pb-10 pt-16 md:pb-12 md:pt-20">
      <div className="container-page max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
          {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
          <h1 className="display text-4xl leading-[1.1] md:text-5xl">{title}</h1>
          {subtitle && <p className="mt-5 max-w-3xl text-lg leading-relaxed text-mist-700 md:text-xl">{subtitle}</p>}
        </motion.div>
      </div>
    </section>
  );
}
