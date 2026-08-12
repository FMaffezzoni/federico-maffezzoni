import { Link } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Video,
  MapPin,
  UserRound,
  FileText
} from 'lucide-react';
import { useDraft } from '../DraftContext';
import { SectionCard } from '../components/fields';

const CARDS = [
  { to: '/admin/profile', title: 'Personal details', desc: 'Name, role, email, phone, booking link, photos', icon: UserRound },
  { to: '/admin/home', title: 'Home page', desc: 'Hero copy, availability, trust block, pillars', icon: FileText },
  { to: '/admin/services', title: 'Services & fees', desc: 'Add, edit, or hide service offerings', icon: Briefcase },
  { to: '/admin/testimonials', title: 'Testimonials', desc: 'Upload MioDottore review screenshots', icon: BookOpen },
  { to: '/admin/publications', title: 'Publications', desc: 'Citations, years, and optional links', icon: BookOpen },
  { to: '/admin/media', title: 'Media', desc: 'Telecolor and other video appearances', icon: Video },
  { to: '/admin/contact', title: 'Locations', desc: 'Clinics, addresses, payment notes', icon: MapPin }
];

export default function AdminOverview() {
  const { draft } = useDraft();
  const stats = [
    { label: 'Services', value: draft.services?.items?.length || 0 },
    { label: 'Conditions', value: draft.conditions?.sections?.length || draft.conditions?.items?.length || 0 },
    { label: 'Videos', value: draft.media?.items?.length || 0 },
    { label: 'Publications', value: draft.publications?.items?.length || 0 },
    { label: 'Locations', value: draft.contact?.locations?.length || 0 }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-3xl text-mist-900">Dashboard</h1>
        <p className="mt-2 max-w-2xl text-mist-600">
          Edit everything visitors see on the site. Changes are bilingual (IT / EN). Use Save on any page
          when you are ready to publish.
        </p>
        {draft.updatedAt && (
          <p className="mt-2 text-xs text-mist-500">
            Last saved: {new Date(draft.updatedAt).toLocaleString()}
          </p>
        )}
      </div>

      <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="rounded-2xl border border-mist-200 bg-white/70 px-4 py-4 text-center">
            <p className="font-display text-2xl text-mist-900">{s.value}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-mist-500">{s.label}</p>
          </div>
        ))}
      </div>

      <SectionCard title="Quick links" description="Jump into the most common editing tasks.">
        <div className="grid gap-3 md:grid-cols-2">
          {CARDS.map(({ to, title, desc, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className="flex gap-3 rounded-2xl border border-mist-200 bg-mist-50/40 p-4 transition hover:border-mist-400 hover:bg-white"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-mist-100 text-mist-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-mist-900">{title}</p>
                <p className="mt-1 text-sm text-mist-600">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
