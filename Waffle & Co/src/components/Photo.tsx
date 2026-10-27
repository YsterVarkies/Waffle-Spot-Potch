import type { ImgHTMLAttributes } from 'react';
import { photos, photoSrc, type PhotoName } from '@/data/photos';

type PhotoProps = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'srcSet' | 'width' | 'height'> & {
  name: PhotoName;
  priority?: boolean;
};

/** A listing photograph with both widths in srcset, real dimensions and alt text. */
export function Photo({ name, priority = false, alt, sizes = '100vw', className = '', ...rest }: PhotoProps) {
  const p = photos[name];
  const smallWidth = p.sizes[0];
  return (
    <img
      src={photoSrc(name, 1)}
      srcSet={`${photoSrc(name, 0)} ${smallWidth}w, ${photoSrc(name, 1)} ${p.width}w`}
      sizes={sizes}
      width={p.width}
      height={p.height}
      alt={alt ?? p.alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : undefined}
      className={`photo ${className}`}
      {...rest}
    />
  );
}
