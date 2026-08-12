import { uid } from '../../content/defaultContent';
import { useDraft } from '../DraftContext';
import { AddButton, BilingualField, ItemCard, SectionCard } from '../components/fields';

export default function ConditionsEditor() {
  const { draft, update } = useDraft();
  const conditions = draft.conditions || { title: { it: '', en: '' }, subtitle: { it: '', en: '' }, sections: [], items: [] };
  const sections = conditions.sections || [];

  const setConditions = (patch) =>
    update((d) => ({ ...d, conditions: { ...d.conditions, ...patch } }));

  const updateSection = (id, patch) =>
    setConditions({
      sections: sections.map((s) => (s.id === id ? { ...s, ...patch } : s))
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Areas of care</h1>
        <p className="mt-2 text-mist-600">
          Grouped clinical areas (adults, adolescents, couples, parenting, chronic pain).
        </p>
      </div>

      <SectionCard title="Page header">
        <BilingualField label="Title" value={conditions.title} onChange={(title) => setConditions({ title })} />
        <BilingualField
          label="Subtitle"
          value={conditions.subtitle}
          onChange={(subtitle) => setConditions({ subtitle })}
          rows={2}
        />
      </SectionCard>

      <SectionCard
        title="Care sections"
        actions={
          <AddButton
            onClick={() =>
              setConditions({
                sections: [
                  ...sections,
                  {
                    id: uid(),
                    title: { it: '', en: '' },
                    intro: { it: '', en: '' },
                    items: [{ id: uid(), it: '', en: '' }]
                  }
                ]
              })
            }
          >
            + Add section
          </AddButton>
        }
      >
        {sections.map((section, si) => (
          <ItemCard
            key={section.id}
            title={`Section ${si + 1}`}
            onRemove={() =>
              setConditions({ sections: sections.filter((s) => s.id !== section.id) })
            }
          >
            <BilingualField
              label="Section title"
              value={section.title}
              onChange={(title) => updateSection(section.id, { title })}
            />
            <BilingualField
              label="Intro"
              value={section.intro}
              onChange={(intro) => updateSection(section.id, { intro })}
              rows={4}
            />
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-mist-600">Items</p>
                <AddButton
                  onClick={() =>
                    updateSection(section.id, {
                      items: [...(section.items || []), { id: uid(), it: '', en: '' }]
                    })
                  }
                >
                  + Add item
                </AddButton>
              </div>
              {(section.items || []).map((item, ii) => (
                <ItemCard
                  key={item.id}
                  title={`Item ${ii + 1}`}
                  onRemove={() =>
                    updateSection(section.id, {
                      items: section.items.filter((x) => x.id !== item.id)
                    })
                  }
                >
                  <BilingualField
                    value={item}
                    onChange={(next) =>
                      updateSection(section.id, {
                        items: section.items.map((x) =>
                          x.id === item.id ? { ...x, ...next } : x
                        )
                      })
                    }
                  />
                </ItemCard>
              ))}
            </div>
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
