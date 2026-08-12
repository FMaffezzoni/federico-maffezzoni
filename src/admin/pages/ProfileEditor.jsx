import { useDraft } from '../DraftContext';
import { uploadFile } from '../../content/api';
import { BilingualField, Field, SectionCard, TextInput } from '../components/fields';

export default function ProfileEditor() {
  const { draft, update, setError, setMessage } = useDraft();
  const profile = draft.profile;

  const setProfile = (patch) =>
    update((d) => ({ ...d, profile: { ...d.profile, ...patch } }));

  const onUpload = async (key, file) => {
    if (!file) return;
    try {
      setMessage('Uploading…');
      const { url } = await uploadFile(file);
      setProfile({ [key]: url });
      setMessage('Photo uploaded — remember to Save');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Profile & photos</h1>
        <p className="mt-2 text-mist-600">Personal details shown across the site and contact pages.</p>
      </div>

      <SectionCard title="Identity">
        <BilingualField
          label="Display name / brand"
          value={profile.brand}
          onChange={(brand) => setProfile({ brand })}
        />
        <BilingualField label="Professional role" value={profile.role} onChange={(role) => setProfile({ role })} />
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Email">
            <TextInput type="email" value={profile.email} onChange={(email) => setProfile({ email })} />
          </Field>
          <Field label="Phone">
            <TextInput value={profile.phone} onChange={(phone) => setProfile({ phone })} />
          </Field>
        </div>
        <Field label="MioDottore booking URL" hint="Used by all Book appointment buttons.">
          <TextInput value={profile.bookingUrl} onChange={(bookingUrl) => setProfile({ bookingUrl })} />
        </Field>
        <Field label="CV download URL" hint="PDF served from /public, e.g. /CV_Federico_Maffezzoni.pdf">
          <TextInput
            value={profile.cvUrl || ''}
            onChange={(cvUrl) => setProfile({ cvUrl })}
            placeholder="/CV_Federico_Maffezzoni.pdf"
          />
        </Field>
      </SectionCard>

      <SectionCard title="Photos" description="Use /images/federico.png (home) and /images/Fede.png (about), or upload new files.">
        <div className="grid gap-6 md:grid-cols-2">
          {['photoHome', 'photoAbout'].map((key) => (
            <div key={key} className="space-y-3">
              <Field label={key === 'photoHome' ? 'Home hero photo' : 'About page photo'}>
                <TextInput value={profile[key]} onChange={(v) => setProfile({ [key]: v })} />
              </Field>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => onUpload(key, e.target.files?.[0])}
                className="block w-full text-sm text-mist-600 file:mr-3 file:rounded-full file:border-0 file:bg-mist-100 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-mist-800"
              />
              {profile[key] && (
                <img
                  src={profile[key]}
                  alt=""
                  className="h-40 w-full rounded-xl object-cover object-top"
                />
              )}
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
