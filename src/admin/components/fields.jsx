const inputClass =
  'w-full rounded-xl border border-mist-200 bg-white px-3.5 py-2.5 text-sm text-slateink-800 shadow-sm outline-none transition focus:border-mist-500 focus:ring-2 focus:ring-mist-200';

const labelClass = 'mb-1.5 block text-xs font-semibold uppercase tracking-[0.12em] text-mist-600';

export function Field({ label, hint, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      {label && <span className={labelClass}>{label}</span>}
      {children}
      {hint && <span className="mt-1 block text-xs text-mist-500">{hint}</span>}
    </label>
  );
}

export function TextInput({ value, onChange, type = 'text', placeholder, rows, ...rest }) {
  if (rows) {
    return (
      <textarea
        className={`${inputClass} min-h-[96px] resize-y`}
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        {...rest}
      />
    );
  }
  return (
    <input
      className={inputClass}
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      {...rest}
    />
  );
}

export function BilingualField({ label, value, onChange, rows, hint }) {
  const v = value || { it: '', en: '' };
  return (
    <div className="space-y-3 rounded-2xl border border-mist-100 bg-mist-50/50 p-4">
      {label && <p className={labelClass}>{label}</p>}
      <Field label="Italiano">
        <TextInput rows={rows} value={v.it} onChange={(it) => onChange({ ...v, it })} />
      </Field>
      <Field label="English">
        <TextInput rows={rows} value={v.en} onChange={(en) => onChange({ ...v, en })} />
      </Field>
      {hint && <p className="text-xs text-mist-500">{hint}</p>}
    </div>
  );
}

export function SectionCard({ title, description, children, actions }) {
  return (
    <section className="rounded-2xl border border-mist-200/80 bg-white/80 p-5 shadow-sm backdrop-blur md:p-6">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-xl text-mist-900">{title}</h2>
          {description && <p className="mt-1 text-sm text-mist-600">{description}</p>}
        </div>
        {actions}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

export function Toggle({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-2 text-sm font-medium text-mist-700"
    >
      <span
        className={`relative h-5 w-9 rounded-full transition ${checked ? 'bg-mist-600' : 'bg-mist-200'}`}
      >
        <span
          className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition ${
            checked ? 'left-4' : 'left-0.5'
          }`}
        />
      </span>
      {label}
    </button>
  );
}

export function ItemCard({ title, children, onRemove, badge }) {
  return (
    <div className="rounded-2xl border border-mist-200 bg-sand-50/60 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <p className="text-sm font-semibold text-mist-800">{title}</p>
          {badge}
        </div>
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg px-2.5 py-1 text-xs font-semibold text-red-700 transition hover:bg-red-50"
          >
            Delete
          </button>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

export function AddButton({ onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-mist-400 bg-white px-4 py-2 text-sm font-semibold text-mist-700 transition hover:border-mist-600 hover:bg-mist-50"
    >
      {children}
    </button>
  );
}
