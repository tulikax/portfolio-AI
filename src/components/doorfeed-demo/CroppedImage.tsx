export interface Crop {
  /** Natural pixel dimensions of the source file. */
  width: number
  height: number
  /** Pixels trimmed from each edge, in source pixels. */
  left?: number
  right?: number
  top?: number
  bottom?: number
}

interface Props {
  src: string
  alt: string
  crop?: Crop
}

/**
 * Renders an image, optionally showing only a region of it.
 *
 * Screenshots arrive with whatever empty canvas the capture happened to
 * include. Rather than editing the source files, the crop is expressed in
 * source pixels and applied at render time: the wrapper takes the aspect ratio
 * of the visible region and the image is scaled and offset behind it.
 */
export default function CroppedImage({ src, alt, crop }: Props) {
  if (!crop) {
    return <img src={src} alt={alt} loading="lazy" style={{ width: '100%', display: 'block' }} />
  }

  const left = crop.left ?? 0
  const right = crop.right ?? 0
  const top = crop.top ?? 0
  const bottom = crop.bottom ?? 0

  const visibleWidth = Math.max(1, crop.width - left - right)
  const visibleHeight = Math.max(1, crop.height - top - bottom)

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        aspectRatio: `${visibleWidth} / ${visibleHeight}`,
      }}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={{
          position: 'absolute',
          // Percentages resolve against the wrapper, which is the visible region
          width: `${(crop.width / visibleWidth) * 100}%`,
          height: 'auto',
          maxWidth: 'none',
          left: `${(-left / visibleWidth) * 100}%`,
          top: `${(-top / visibleHeight) * 100}%`,
          display: 'block',
        }}
      />
    </div>
  )
}
