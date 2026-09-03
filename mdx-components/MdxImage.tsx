import Image from 'next/image';
import manifest from '@/lib/image-manifest.json';

type Manifest = Record<string, { width: number; height: number }>;
const SIZES = manifest as Manifest;

/** The article column is max-w-4xl. */
const COLUMN = 896;

/**
 * MDX content frequently constrains an image with a width utility on the tag
 * itself. Reading it here keeps `sizes` honest, so a picture drawn at 75% of
 * the column does not download a full-column source.
 */
function sizesFor(className?: string) {
  const fraction = className?.includes('w-1/2')
    ? 0.5
    : className?.includes('w-2/3')
      ? 0.667
      : className?.includes('w-3/4')
        ? 0.75
        : 1;
  return `(max-width: 900px) ${Math.round(92 * fraction)}vw, ${Math.round(COLUMN * fraction)}px`;
}

/**
 * Every image inside MDX renders through here — responsive sources, lazy
 * loading, and a box reserved from the build-time manifest instead of a raw
 * full-size download.
 */
export default function MdxImage({
  src,
  alt = '',
  className,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement>) {
  if (typeof src !== 'string') return null;

  const dims = SIZES[src];
  if (!dims) {
    // Remote or unmanifested source: a plain tag rather than a guessed ratio.
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} loading="lazy" decoding="async" className={className} {...rest} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={dims.width}
      height={dims.height}
      sizes={sizesFor(className)}
      className={className}
    />
  );
}
