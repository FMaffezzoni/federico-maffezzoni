import { uid } from '../../content/defaultContent';
import { useDraft } from '../DraftContext';
import { AddButton, BilingualField, Field, ItemCard, SectionCard, TextInput } from '../components/fields';

export default function ContactEditor() {
  const { draft, update } = useDraft();
  const contact = draft.contact;
  const setContact = (patch) => update((d) => ({ ...d, contact: { ...d.contact, ...patch } }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Contact & locations</h1>
        <p className="mt-2 text-mist-600">Clinic addresses, payment notes, and contact page copy.</p>
      </div>

      <SectionCard title="Page header">
        <BilingualField label="Title" value={contact.title} onChange={(title) => setContact({ title })} />
        <BilingualField
          label="Subtitle"
          value={contact.subtitle}
          onChange={(subtitle) => setContact({ subtitle })}
          rows={2}
        />
        <BilingualField
          label="Book online label"
          value={contact.bookOnline}
          onChange={(bookOnline) => setContact({ bookOnline })}
        />
      </SectionCard>

      <SectionCard
        title="Locations"
        actions={
          <AddButton
            onClick={() =>
              setContact({
                locations: [
                  ...contact.locations,
                  {
                    id: uid(),
                    name: { it: '', en: '' },
                    address: { it: '', en: '' },
                    phone: ''
                  }
                ]
              })
            }
          >
            + Add location
          </AddButton>
        }
      >
        {contact.locations.map((loc, i) => (
          <ItemCard
            key={loc.id}
            title={`Location ${i + 1}`}
            onRemove={() =>
              setContact({ locations: contact.locations.filter((x) => x.id !== loc.id) })
            }
          >
            <BilingualField
              label="Name"
              value={loc.name}
              onChange={(name) =>
                setContact({
                  locations: contact.locations.map((x) => (x.id === loc.id ? { ...x, name } : x))
                })
              }
            />
            <BilingualField
              label="Address"
              value={loc.address}
              onChange={(address) =>
                setContact({
                  locations: contact.locations.map((x) => (x.id === loc.id ? { ...x, address } : x))
                })
              }
              rows={2}
            />
            <Field label="Phone (optional override)">
              <TextInput
                value={loc.phone || ''}
                onChange={(phone) =>
                  setContact({
                    locations: contact.locations.map((x) => (x.id === loc.id ? { ...x, phone } : x))
                  })
                }
              />
            </Field>
          </ItemCard>
        ))}
      </SectionCard>

      <SectionCard
        title="Payment methods"
        actions={
          <AddButton
            onClick={() => setContact({ payments: [...contact.payments, { id: uid(), it: '', en: '' }] })}
          >
            + Add payment note
          </AddButton>
        }
      >
        <BilingualField
          label="Section title"
          value={contact.paymentTitle}
          onChange={(paymentTitle) => setContact({ paymentTitle })}
        />
        {contact.payments.map((p, i) => (
          <ItemCard
            key={p.id}
            title={`Payment ${i + 1}`}
            onRemove={() => setContact({ payments: contact.payments.filter((x) => x.id !== p.id) })}
          >
            <BilingualField
              value={p}
              onChange={(next) =>
                setContact({
                  payments: contact.payments.map((x) => (x.id === p.id ? { ...x, ...next } : x))
                })
              }
            />
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
