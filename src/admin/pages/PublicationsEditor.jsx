import { uid } from '../../content/defaultContent';
import { useDraft } from '../DraftContext';
import {
  AddButton,
  Field,
  ItemCard,
  SectionCard,
  TextInput,
  Toggle,
  BilingualField
} from '../components/fields';

export default function PublicationsEditor() {
  const { draft, update } = useDraft();
  const publications = draft.publications;
  const setPubs = (patch) =>
    update((d) => ({ ...d, publications: { ...d.publications, ...patch } }));
  const updateItem = (id, patch) =>
    setPubs({ items: publications.items.map((p) => (p.id === id ? { ...p, ...patch } : p)) });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Publications</h1>
        <p className="mt-2 text-mist-600">
          Full CRUD for scientific and clinical publications. Inactive items stay in the CMS but are hidden on the site.
        </p>
      </div>

      <SectionCard title="Page header">
        <BilingualField
          label="Title"
          value={publications.title}
          onChange={(title) => setPubs({ title })}
        />
      </SectionCard>

      <SectionCard
        title="Publication list"
        description={`${publications.items.length} total · ${
          publications.items.filter((p) => p.active !== false).length
        } visible`}
        actions={
          <AddButton
            onClick={() =>
              setPubs({
                items: [
                  { id: uid(), citation: '', year: '', link: '', active: true },
                  ...publications.items
                ]
              })
            }
          >
            + Add publication
          </AddButton>
        }
      >
        {publications.items.map((p, i) => (
          <ItemCard
            key={p.id}
            title={`Publication ${i + 1}`}
            badge={
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  p.active !== false ? 'bg-mist-100 text-mist-700' : 'bg-sand-200 text-mist-600'
                }`}
              >
                {p.active !== false ? 'Visible' : 'Hidden'}
              </span>
            }
            onRemove={() => {
              if (window.confirm('Delete this publication?')) {
                setPubs({ items: publications.items.filter((x) => x.id !== p.id) });
              }
            }}
          >
            <Field label="Full citation">
              <TextInput
                rows={4}
                value={p.citation}
                onChange={(citation) => updateItem(p.id, { citation })}
                placeholder="Authors (Year). Title. Journal…"
              />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <Field label="Year">
                <TextInput value={p.year} onChange={(year) => updateItem(p.id, { year })} placeholder="2024" />
              </Field>
              <Field label="Link (optional)">
                <TextInput
                  value={p.link}
                  onChange={(link) => updateItem(p.id, { link })}
                  placeholder="https://…"
                />
              </Field>
            </div>
            <Toggle
              checked={p.active !== false}
              onChange={(active) => updateItem(p.id, { active })}
              label="Show on website"
            />
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
