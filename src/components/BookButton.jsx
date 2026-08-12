import { CalendarCheck, ExternalLink } from 'lucide-react';
import { MIODOTTORE_URL } from '../constants/links';
import { useLanguage } from '../i18n/LanguageContext';

export default function BookButton({
  className = '',
  variant = 'primary',
  showIcon = true,
  fullWidth = false
}) {
  const { t } = useLanguage();
  const base = variant === 'primary' ? 'btn-primary' : 'btn-secondary';
  const href = t.meta?.bookingUrl || MIODOTTORE_URL;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${base} ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      {showIcon && <CalendarCheck className="h-4 w-4" />}
      {t.cta.bookMioDottore}
      <ExternalLink className="h-3.5 w-3.5 opacity-80" />
    </a>
  );
}
