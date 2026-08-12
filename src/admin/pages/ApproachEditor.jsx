import { uid } from '../../content/defaultContent';
import { useDraft } from '../DraftContext';
import { AddButton, BilingualField, ItemCard, SectionCard } from '../components/fields';

export default function ApproachEditor() {
  const { draft, update } = useDraft();
  const approach = draft.approach;
  const setApproach = (patch) => update((d) => ({ ...d, approach: { ...d.approach, ...patch } }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Approach</h1>
        <p className="mt-2 text-mist-600">Clinical approach page and focus areas.</p>
      </div>

      <SectionCard title="Page copy">
        <BilingualField label="Title" value={approach.title} onChange={(title) => setApproach({ title })} />
        <BilingualField
          label="Subtitle"
          value={approach.subtitle}
          onChange={(subtitle) => setApproach({ subtitle })}
          rows={2}
        />
        <BilingualField label="Body" value={approach.body} onChange={(body) => setApproach({ body })} rows={6} />
        <BilingualField
          label="Areas section title"
          value={approach.areasTitle}
          onChange={(areasTitle) => setApproach({ areasTitle })}
        />
      </SectionCard>

      <SectionCard
        title="Focus areas"
        actions={
          <AddButton onClick={() => setApproach({ areas: [...approach.areas, { id: uid(), it: '', en: '' }] })}>
            + Add area
          </AddButton>
        }
      >
        {approach.areas.map((a, i) => (
          <ItemCard
            key={a.id}
            title={`Area ${i + 1}`}
            onRemove={() => setApproach({ areas: approach.areas.filter((x) => x.id !== a.id) })}
          >
            <BilingualField
              value={a}
              onChange={(next) =>
                setApproach({ areas: approach.areas.map((x) => (x.id === a.id ? { ...x, ...next } : x)) })
              }
            />
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
