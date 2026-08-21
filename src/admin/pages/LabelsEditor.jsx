import { useDraft } from '../DraftContext';
import { BilingualField, SectionCard } from '../components/fields';

const NAV_KEYS = ['about', 'services', 'resources', 'insights', 'contact'];

const CTA_KEYS = [
  'book',
  'bookMioDottore',
  'contact',
  'email',
  'learnMore',
  'locations',
  'online',
  'watch',
  'photoHint',
  'downloadCv'
];

export default function LabelsEditor() {
  const { draft, update } = useDraft();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Nav & labels</h1>
        <p className="mt-2 text-mist-600">Navigation labels, CTA buttons, and footer text.</p>
      </div>

      <SectionCard title="Navigation">
        {NAV_KEYS.map((key) => (
          <BilingualField
            key={key}
            label={key}
            value={draft.nav[key] || { it: '', en: '' }}
            onChange={(v) => update((d) => ({ ...d, nav: { ...d.nav, [key]: v } }))}
          />
        ))}
      </SectionCard>

      <SectionCard title="Call-to-action labels">
        {CTA_KEYS.map((key) => (
          <BilingualField
            key={key}
            label={key}
            value={draft.cta[key]}
            onChange={(v) => update((d) => ({ ...d, cta: { ...d.cta, [key]: v } }))}
          />
        ))}
      </SectionCard>

      <SectionCard title="Resources page">
        <BilingualField
          label="Page title"
          value={draft.resources?.title}
          onChange={(title) => update((d) => ({ ...d, resources: { ...d.resources, title } }))}
        />
        <BilingualField
          label="Page subtitle"
          value={draft.resources?.subtitle}
          onChange={(subtitle) => update((d) => ({ ...d, resources: { ...d.resources, subtitle } }))}
          rows={2}
        />
      </SectionCard>

      <SectionCard title="Footer">
        <BilingualField
          label="Rights line"
          value={draft.footer.rights}
          onChange={(rights) => update((d) => ({ ...d, footer: { ...d.footer, rights } }))}
        />
        <BilingualField
          label="Note"
          value={draft.footer.note}
          onChange={(note) => update((d) => ({ ...d, footer: { ...d.footer, note } }))}
          rows={2}
        />
      </SectionCard>
    </div>
  );
}
