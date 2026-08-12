import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Briefcase,
  Video,
  FileText,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  Settings,
  UserRound,
  X,
  Stethoscope,
  Heart,
  Languages,
  MessageSquare
} from 'lucide-react';
import { useState } from 'react';
import { useAdminAuth } from './AdminAuth';
import { DraftProvider } from './DraftContext';
import SaveBar from './components/SaveBar';

const NAV = [
  { to: '/admin', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/admin/profile', label: 'Profile & photos', icon: UserRound },
  { to: '/admin/home', label: 'Home page', icon: Home },
  { to: '/admin/about', label: 'About', icon: FileText },
  { to: '/admin/approach', label: 'Approach', icon: Heart },
  { to: '/admin/services', label: 'Services & fees', icon: Briefcase },
  { to: '/admin/conditions', label: 'Conditions', icon: Stethoscope },
  { to: '/admin/media', label: 'Media / videos', icon: Video },
  { to: '/admin/testimonials', label: 'Testimonials', icon: MessageSquare },
  { to: '/admin/publications', label: 'Publications', icon: BookOpen },
  { to: '/admin/contact', label: 'Contact & locations', icon: MapPin },
  { to: '/admin/labels', label: 'Nav & labels', icon: Languages },
  { to: '/admin/settings', label: 'Settings', icon: Settings }
];

function SidebarNav({ onNavigate }) {
  return (
    <nav className="space-y-1">
      {NAV.map(({ to, end, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
              isActive
                ? 'bg-mist-700 text-white shadow-sm'
                : 'text-mist-700 hover:bg-mist-100'
            }`
          }
        >
          <Icon className="h-4 w-4 shrink-0 opacity-90" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

export default function AdminLayout() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <DraftProvider>
      <div className="min-h-screen bg-[linear-gradient(180deg,#f4f7f6_0%,#eef3f1_100%)]">
        <div className="mx-auto flex min-h-screen max-w-7xl">
          <aside className="hidden w-64 shrink-0 border-r border-mist-200/80 bg-white/70 p-5 backdrop-blur lg:block">
            <div className="mb-8">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-mist-500">CMS</p>
              <h1 className="mt-1 font-display text-xl text-mist-900">Federico Admin</h1>
            </div>
            <SidebarNav />
            <button
              type="button"
              onClick={handleLogout}
              className="mt-8 inline-flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-mist-600 transition hover:bg-mist-100"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </aside>

          <div className="flex min-w-0 flex-1 flex-col">
            <header className="flex items-center justify-between border-b border-mist-200/80 bg-white/60 px-4 py-3 backdrop-blur lg:hidden">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-mist-500">CMS</p>
                <p className="font-display text-lg text-mist-900">Admin</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen((v) => !v)}
                className="rounded-xl border border-mist-200 bg-white p-2 text-mist-700"
                aria-label="Toggle menu"
              >
                {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </header>

            {open && (
              <div className="border-b border-mist-200 bg-white/95 p-4 lg:hidden">
                <SidebarNav onNavigate={() => setOpen(false)} />
                <button
                  type="button"
                  onClick={handleLogout}
                  className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-mist-600"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            )}

            <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
              <SaveBar />
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </DraftProvider>
  );
}
