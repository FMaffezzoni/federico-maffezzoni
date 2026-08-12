import { uid } from '../../content/defaultContent';
import { useDraft } from '../DraftContext';
import { AddButton, BilingualField, ItemCard, SectionCard } from '../components/fields';

export default function AboutEditor() {
  const { draft, update } = useDraft();
  const about = draft.about;
  const setAbout = (patch) => update((d) => ({ ...d, about: { ...d.about, ...patch } }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">About</h1>
        <p className="mt-2 text-mist-600">Biography, education, languages, and awards.</p>
      </div>

      <SectionCard title="Intro">
        <BilingualField label="Page title" value={about.title} onChange={(title) => setAbout({ title })} />
        <BilingualField label="Intro" value={about.intro} onChange={(intro) => setAbout({ intro })} rows={3} />
      </SectionCard>

      <SectionCard
        title="Biography paragraphs"
        actions={
          <AddButton
            onClick={() =>
              setAbout({ bio: [...about.bio, { id: uid(), it: '', en: '' }] })
            }
          >
            + Add paragraph
          </AddButton>
        }
      >
        {about.bio.map((b, i) => (
          <ItemCard
            key={b.id}
            title={`Paragraph ${i + 1}`}
            onRemove={() => setAbout({ bio: about.bio.filter((x) => x.id !== b.id) })}
          >
            <BilingualField
              value={b}
              rows={4}
              onChange={(next) =>
                setAbout({ bio: about.bio.map((x) => (x.id === b.id ? { ...x, ...next } : x)) })
              }
            />
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Education"
        actions={
          <AddButton
            onClick={() =>
              setAbout({
                education: [
                  ...about.education,
                  { id: uid(), place: { it: '', en: '' }, detail: { it: '', en: '' } }
                ]
              })
            }
          >
            + Add education
          </AddButton>
        }
      >
        <BilingualField
          label="Section title"
          value={about.educationTitle}
          onChange={(educationTitle) => setAbout({ educationTitle })}
        />
        {about.education.map((e, i) => (
          <ItemCard
            key={e.id}
            title={`Entry ${i + 1}`}
            onRemove={() => setAbout({ education: about.education.filter((x) => x.id !== e.id) })}
          >
            <BilingualField
              label="Institution / place"
              value={e.place}
              onChange={(place) =>
                setAbout({ education: about.education.map((x) => (x.id === e.id ? { ...x, place } : x)) })
              }
            />
            <BilingualField
              label="Detail"
              value={e.detail}
              onChange={(detail) =>
                setAbout({ education: about.education.map((x) => (x.id === e.id ? { ...x, detail } : x)) })
              }
              rows={2}
            />
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Languages"
        actions={
          <AddButton onClick={() => setAbout({ languages: [...about.languages, { id: uid(), it: '', en: '' }] })}>
            + Add language
          </AddButton>
        }
      >
        <BilingualField
          label="Section title"
          value={about.languagesTitle}
          onChange={(languagesTitle) => setAbout({ languagesTitle })}
        />
        {about.languages.map((l, i) => (
          <ItemCard
            key={l.id}
            title={`Language ${i + 1}`}
            onRemove={() => setAbout({ languages: about.languages.filter((x) => x.id !== l.id) })}
          >
            <BilingualField
              value={l}
              onChange={(next) =>
                setAbout({ languages: about.languages.map((x) => (x.id === l.id ? { ...x, ...next } : x)) })
              }
            />
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Awards"
        actions={
          <AddButton onClick={() => setAbout({ awards: [...about.awards, { id: uid(), it: '', en: '' }] })}>
            + Add award
          </AddButton>
        }
      >
        <BilingualField
          label="Section title"
          value={about.awardsTitle}
          onChange={(awardsTitle) => setAbout({ awardsTitle })}
        />
        {about.awards.map((a, i) => (
          <ItemCard
            key={a.id}
            title={`Award ${i + 1}`}
            onRemove={() => setAbout({ awards: about.awards.filter((x) => x.id !== a.id) })}
          >
            <BilingualField
              value={a}
              rows={2}
              onChange={(next) =>
                setAbout({ awards: about.awards.map((x) => (x.id === a.id ? { ...x, ...next } : x)) })
              }
            />
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
