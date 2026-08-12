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

export default function ServicesEditor() {
  const { draft, update } = useDraft();
  const services = draft.services;
  const setServices = (patch) => update((d) => ({ ...d, services: { ...d.services, ...patch } }));

  const updateItem = (id, patch) =>
    setServices({ items: services.items.map((s) => (s.id === id ? { ...s, ...patch } : s)) });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Services & fees</h1>
        <p className="mt-2 text-mist-600">Add, edit, hide, or delete service offerings.</p>
      </div>

      <SectionCard title="Page header">
        <BilingualField label="Title" value={services.title} onChange={(title) => setServices({ title })} />
        <BilingualField
          label="Subtitle"
          value={services.subtitle}
          onChange={(subtitle) => setServices({ subtitle })}
          rows={2}
        />
        <BilingualField label="Note" value={services.note} onChange={(note) => setServices({ note })} rows={2} />
      </SectionCard>

      <SectionCard
        title="Service list"
        actions={
          <AddButton
            onClick={() =>
              setServices({
                items: [
                  ...services.items,
                  { id: uid(), name: { it: '', en: '' }, price: '', active: true }
                ]
              })
            }
          >
            + Add service
          </AddButton>
        }
      >
        {services.items.map((s, i) => (
          <ItemCard
            key={s.id}
            title={`Service ${i + 1}`}
            badge={
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  s.active !== false ? 'bg-mist-100 text-mist-700' : 'bg-sand-200 text-mist-600'
                }`}
              >
                {s.active !== false ? 'Visible' : 'Hidden'}
              </span>
            }
            onRemove={() => setServices({ items: services.items.filter((x) => x.id !== s.id) })}
          >
            <BilingualField label="Name" value={s.name} onChange={(name) => updateItem(s.id, { name })} />
            <Field label="Price / fee">
              <TextInput value={s.price} onChange={(price) => updateItem(s.id, { price })} />
            </Field>
            <Toggle
              checked={s.active !== false}
              onChange={(active) => updateItem(s.id, { active })}
              label="Show on website"
            />
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
