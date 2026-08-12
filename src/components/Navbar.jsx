import { NavLink, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import BookButton from './BookButton';

const links = [
  ['/about', 'about'],
  ['/services', 'services'],
  ['/resources', 'resources'],
  ['/contact', 'contact']
];

export default function Navbar() {
  const { t, lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[#f7f6f3]/80 backdrop-blur-xl">
      <div className="container-page flex items-center justify-between gap-4 py-4">
        <Link to="/" className="min-w-0" onClick={() => setOpen(false)}>
          <div className="display text-lg leading-tight text-mist-800 sm:text-xl">{t.brand}</div>
          <div className="text-xs text-mist-600 sm:text-sm">{t.role}</div>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex">
          {links.map(([to, key]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `rounded-full px-3 py-2 text-sm transition ${
                  isActive ? 'bg-mist-700 text-white' : 'text-mist-800 hover:bg-mist-100'
                }`
              }
            >
              {t.nav[key]}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex rounded-full border border-mist-200 bg-white/70 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setLang('it')}
              className={`rounded-full px-2.5 py-1 ${lang === 'it' ? 'bg-mist-700 text-white' : 'text-mist-700'}`}
            >
              IT
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-full px-2.5 py-1 ${lang === 'en' ? 'bg-mist-700 text-white' : 'text-mist-700'}`}
            >
              EN
            </button>
          </div>

          <div className="hidden sm:block">
            <BookButton className="!px-4 !py-2 text-xs" />
          </div>

          <button
            type="button"
            className="rounded-full border border-mist-200 bg-white/70 p-2 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-mist-100 bg-[#f7f6f3]/95 px-5 py-4 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map(([to, key]) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-xl px-3 py-3 text-sm ${isActive ? 'bg-mist-700 text-white' : 'text-mist-800 hover:bg-mist-100'}`
                }
              >
                {t.nav[key]}
              </NavLink>
            ))}
            <div className="pt-3">
              <BookButton fullWidth />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
