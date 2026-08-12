import { uid } from '../../content/defaultContent';
import { useDraft } from '../DraftContext';
import { AddButton, BilingualField, ItemCard, SectionCard } from '../components/fields';

export default function HomeEditor() {
  const { draft, update } = useDraft();
  const home = draft.home;

  const setHome = (patch) => update((d) => ({ ...d, home: { ...d.home, ...patch } }));

  const updatePillar = (id, patch) =>
    setHome({
      pillars: home.pillars.map((p) => (p.id === id ? { ...p, ...patch } : p))
    });

  const addPillar = () =>
    setHome({
      pillars: [...home.pillars, { id: uid(), title: { it: '', en: '' }, text: { it: '', en: '' } }]
    });

  const removePillar = (id) => setHome({ pillars: home.pillars.filter((p) => p.id !== id) });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Home page</h1>
        <p className="mt-2 text-mist-600">Hero, trust section, and three pillars.</p>
      </div>

      <SectionCard title="Hero">
        <BilingualField label="Eyebrow" value={home.eyebrow} onChange={(eyebrow) => setHome({ eyebrow })} />
        <BilingualField label="Subtitle" value={home.subtitle} onChange={(subtitle) => setHome({ subtitle })} rows={3} />
        <BilingualField
          label="Availability line"
          value={home.availability}
          onChange={(availability) => setHome({ availability })}
        />
      </SectionCard>

      <SectionCard title="Trust block">
        <BilingualField label="Title" value={home.trustTitle} onChange={(trustTitle) => setHome({ trustTitle })} />
        <BilingualField label="Body" value={home.trustBody} onChange={(trustBody) => setHome({ trustBody })} rows={4} />
      </SectionCard>

      <SectionCard
        title="Pillars"
        actions={<AddButton onClick={addPillar}>+ Add pillar</AddButton>}
      >
        {home.pillars.map((p, i) => (
          <ItemCard key={p.id} title={`Pillar ${i + 1}`} onRemove={() => removePillar(p.id)}>
            <BilingualField label="Title" value={p.title} onChange={(title) => updatePillar(p.id, { title })} />
            <BilingualField label="Text" value={p.text} onChange={(text) => updatePillar(p.id, { text })} rows={3} />
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
