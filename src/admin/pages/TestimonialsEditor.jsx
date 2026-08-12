import { uid } from '../../content/defaultContent';
import { uploadFile } from '../../content/api';
import { assetUrl } from '../../utils/assets';
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

export default function TestimonialsEditor() {
  const { draft, update, setError, setMessage } = useDraft();
  const testimonials = draft.testimonials || {
    title: { it: '', en: '' },
    subtitle: { it: '', en: '' },
    sourceLabel: { it: '', en: '' },
    items: []
  };

  const setTestimonials = (patch) =>
    update((d) => ({
      ...d,
      testimonials: { ...(d.testimonials || testimonials), ...patch }
    }));

  const updateItem = (id, patch) =>
    setTestimonials({
      items: testimonials.items.map((item) => (item.id === id ? { ...item, ...patch } : item))
    });

  const onUpload = async (id, file) => {
    if (!file) return;
    try {
      setMessage('Uploading screenshot…');
      const { url } = await uploadFile(file);
      updateItem(id, { image: url });
      setMessage('Screenshot uploaded — remember to Save');
    } catch (err) {
      setError(err.message);
    }
  };

  const addBlank = () =>
    setTestimonials({
      items: [
        {
          id: uid(),
          image: '',
          alt: { it: 'Recensione MioDottore', en: 'MioDottore review' },
          active: true
        },
        ...testimonials.items
      ]
    });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Testimonials</h1>
        <p className="mt-2 max-w-2xl text-mist-600">
          Upload MioDottore review screenshots. The public site shows 4 at a time and slides one-by-one
          through the rest. Place this block above the footer on every page.
        </p>
      </div>

      <SectionCard title="Section labels">
        <BilingualField
          label="Title"
          value={testimonials.title}
          onChange={(title) => setTestimonials({ title })}
        />
        <BilingualField
          label="Subtitle"
          value={testimonials.subtitle}
          onChange={(subtitle) => setTestimonials({ subtitle })}
        />
        <BilingualField
          label="Source label"
          value={testimonials.sourceLabel}
          onChange={(sourceLabel) => setTestimonials({ sourceLabel })}
        />
      </SectionCard>

      <SectionCard
        title="Review screenshots"
        description={`${testimonials.items.length} total · ${
          testimonials.items.filter((i) => i.active !== false).length
        } visible`}
        actions={<AddButton onClick={addBlank}>+ Add screenshot</AddButton>}
      >
        {testimonials.items.map((item, i) => (
          <ItemCard
            key={item.id}
            title={`Review ${i + 1}`}
            badge={
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  item.active !== false ? 'bg-mist-100 text-mist-700' : 'bg-sand-200 text-mist-600'
                }`}
              >
                {item.active !== false ? 'Visible' : 'Hidden'}
              </span>
            }
            onRemove={() => {
              if (window.confirm('Remove this review screenshot?')) {
                setTestimonials({
                  items: testimonials.items.filter((x) => x.id !== item.id)
                });
              }
            }}
          >
            <div className="grid gap-4 md:grid-cols-[1fr_180px]">
              <div className="space-y-3">
                <Field label="Image path / URL">
                  <TextInput
                    value={item.image}
                    onChange={(image) => updateItem(item.id, { image })}
                    placeholder="/images/testimonials/review.png"
                  />
                </Field>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={(e) => onUpload(item.id, e.target.files?.[0])}
                  className="block w-full text-sm text-mist-600 file:mr-3 file:rounded-full file:border-0 file:bg-mist-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-mist-800"
                />
                <BilingualField
                  label="Alt text (accessibility)"
                  value={item.alt}
                  onChange={(alt) => updateItem(item.id, { alt })}
                />
                <Toggle
                  checked={item.active !== false}
                  onChange={(active) => updateItem(item.id, { active })}
                  label="Show on website"
                />
              </div>
              {item.image ? (
                <img
                  src={assetUrl(item.image)}
                  alt=""
                  className="h-40 w-full rounded-xl border border-mist-200 object-cover object-top md:h-full"
                />
              ) : (
                <div className="flex h-40 items-center justify-center rounded-xl border border-dashed border-mist-300 bg-mist-50 text-xs text-mist-500">
                  No image yet
                </div>
              )}
            </div>
          </ItemCard>
        ))}
      </SectionCard>
    </div>
  );
}
