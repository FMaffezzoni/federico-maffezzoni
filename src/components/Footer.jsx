import { Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import BookButton from './BookButton';

export default function Footer() {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-10 border-t border-mist-200/70 bg-mist-900 text-mist-100">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="display text-2xl text-white">{t.brand}</div>
          <p className="mt-3 max-w-md text-mist-200">{t.footer.note}</p>
          <div className="mt-5">
            <BookButton />
          </div>
        </div>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-300" />
            <span>Via Fabio Filzi, 51 · Cremona</span>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-mist-300" />
            <span>Via Guglielmo Oberdan 126 · Brescia</span>
          </div>
          <div className="flex items-start gap-2">
            <Phone className="mt-0.5 h-4 w-4 shrink-0 text-mist-300" />
            <a href="tel:+3903721835363" className="hover:text-white">
              {t.contact.phone}
            </a>
          </div>
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-mist-300" />
            <a href={`mailto:${t.contact.email}`} className="break-all hover:text-white">
              {t.contact.email}
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <Link to="/about" className="hover:text-white">
            {t.nav.about}
          </Link>
          <Link to="/services" className="hover:text-white">
            {t.nav.services}
          </Link>
          <Link to="/resources" className="hover:text-white">
            {t.nav.resources}
          </Link>
          <Link to="/insights" className="hover:text-white">
            {t.nav.insights}
          </Link>
          <Link to="/contact" className="hover:text-white">
            {t.nav.contact}
          </Link>
          <Link to="/en" className="hover:text-white">
            English
          </Link>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs text-mist-300">
        © {year} {t.brand}. {t.footer.rights}
      </div>
    </footer>
  );
}
