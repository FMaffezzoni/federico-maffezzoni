export default function FaqSection({ title, items }) {
  if (!items?.length) return null;
  return (
    <section className="section-space pt-4">
      <div className="container-page max-w-4xl">
        <h2 className="display text-2xl text-mist-900 md:text-3xl">{title}</h2>
        <div className="mt-8 space-y-4">
          {items.map((item) => (
            <details
              key={item.q}
              className="group rounded-2xl border border-mist-200 bg-white/60 px-5 py-4"
            >
              <summary className="cursor-pointer list-none font-semibold text-mist-900 marker:content-none">
                {item.q}
              </summary>
              <p className="mt-3 leading-relaxed text-mist-700">{item.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
