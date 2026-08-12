import { uid } from '../../content/defaultContent';
import { useDraft } from '../DraftContext';
import {
  AddButton,
  BilingualField,
  Field,
  ItemCard,
  SectionCard,
  TextInput,
  Toggle
} from '../components/fields';

export default function MediaEditor() {
  const { draft, update } = useDraft();
  const media = draft.media;
  const setMedia = (patch) => update((d) => ({ ...d, media: { ...d.media, ...patch } }));
  const updateItem = (id, patch) =>
    setMedia({ items: media.items.map((m) => (m.id === id ? { ...m, ...patch } : m)) });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Media / videos</h1>
        <p className="mt-2 text-mist-600">TV appearances and external video links (e.g. Telecolor).</p>
      </div>

      <SectionCard title="Page header">
        <BilingualField label="Title" value={media.title} onChange={(title) => setMedia({ title })} />
        <BilingualField
          label="Subtitle"
          value={media.subtitle}
          onChange={(subtitle) => setMedia({ subtitle })}
          rows={2}
        />
        <BilingualField label="Source note" value={media.source} onChange={(source) => setMedia({ source })} />
      </SectionCard>

      <SectionCard
        title="Video list"
        actions={
          <AddButton
            onClick={() =>
              setMedia({
                items: [
                  ...media.items,
                  { id: uid(), url: '', title: { it: '', en: '' }, active: true }
                ]
              })
            }
          >
            + Add video
          </AddButton>
        }
      >
        {media.items.map((m, i) => (
          <ItemCard
            key={m.id}
            title={`Video ${i + 1}`}
            onRemove={() => setMedia({ items: media.items.filter((x) => x.id !== m.id) })}
          >
            <BilingualField label="Title" value={m.title} onChange={(title) => updateItem(m.id, { title })} rows={2} />
            <Field label="URL">
              <TextInput value={m.url} onChange={(url) => updateItem(m.id, { url })} />
            </Field>
            <Toggle
              checked={m.active !== false}
              onChange={(active) => updateItem(m.id, { active })}
              label="Show on website"
            />
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
