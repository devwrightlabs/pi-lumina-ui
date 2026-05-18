import type { FC } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';
import type { PiLazyImageProps } from '../types/lumina';

/**
 * Lazy image component with downscaled request params and blur-first rendering.
 */
export const PiLazyImage: FC<PiLazyImageProps> = ({
  src,
  alt,
  width,
  height,
  className,
  quality = 70,
  decoding = 'async',
  loading = 'lazy',
  blurDataUrl,
  onLoad
}) => {
  const [visible, setVisible] = useState(loading === 'eager');
  const [loaded, setLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (visible || loading === 'eager') {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: '180px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [visible, loading]);

  const optimizedSrc = useMemo(() => {
    const url = new URL(src, typeof window !== 'undefined' ? window.location.origin : 'https://example.com');
    url.searchParams.set('w', String(width));
    url.searchParams.set('q', String(Math.max(30, Math.min(quality, 90))));
    if (src.startsWith('http://') || src.startsWith('https://')) {
      return url.toString();
    }
    return `${src}${src.includes('?') ? '&' : '?'}w=${width}&q=${Math.max(30, Math.min(quality, 90))}`;
  }, [quality, src, width]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        overflow: 'hidden',
        width,
        height,
        borderRadius: 12,
        background: '#171720'
      }}
    >
      {blurDataUrl && !loaded ? (
        <img
          src={blurDataUrl}
          alt=""
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            filter: 'blur(12px)',
            transform: 'scale(1.05)'
          }}
        />
      ) : null}
      {visible ? (
        <img
          src={optimizedSrc}
          alt={alt}
          width={width}
          height={height}
          decoding={decoding}
          loading={loading}
          onLoad={() => {
            setLoaded(true);
            onLoad?.();
          }}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'opacity 180ms ease' }}
        />
      ) : null}
    </div>
  );
};
