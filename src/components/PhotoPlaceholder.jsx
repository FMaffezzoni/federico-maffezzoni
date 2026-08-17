import { useState } from 'react';
import { Camera } from 'lucide-react';
import { assetUrl } from '../utils/assets';

/**
 * Soft clinical photo frame.
 * Default portraits:
 *   public/images/federico.webp  (home)
 *   public/images/Fede.webp      (about)
 */
export default function PhotoPlaceholder({
  src,
  alt = 'Dott. Federico Maffezzoni - Psicologo Cremona e Brescia',
  className = '',
  label,
  aspect = 'portrait',
  objectPosition = 'center center',
  priority = false
}) {
  const [failed, setFailed] = useState(false);
  const aspectClass = aspect === 'square' ? 'aspect-square' : 'aspect-[4/5]';
  const resolved = assetUrl(src);
  const showImage = Boolean(resolved) && !failed;

  if (showImage) {
    return (
      <div className={`overflow-hidden rounded-[1.6rem] ${aspectClass} ${className}`}>
        <img
          src={resolved}
          alt={alt}
          width={800}
          height={1000}
          className="h-full w-full object-cover"
          style={{ objectPosition }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'low'}
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-mist-200 via-accent-soft to-mist-400 ${aspectClass} ${className}`}
      role="img"
      aria-label={alt}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center text-mist-800">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/55 backdrop-blur">
          <Camera className="h-6 w-6 text-mist-700" />
        </div>
        <p className="display text-lg leading-tight">{alt}</p>
        {label && <p className="max-w-[14rem] text-xs text-mist-700">{label}</p>}
      </div>
    </div>
  );
}
