/**
 * Animated pastel gradient blobs — replaces video backgrounds.
 * All blobs are absolutely positioned, pointer-events none.
 * `fast` prop makes the process section blobs move with dramatic cubic easing.
 */
export default function GradientBlobs({
  variant = 'default',
  fast = false,
}: {
  variant?: 'default' | 'process'
  fast?: boolean
}) {
  // Slow dreamy movement vs fast cubic snapping
  const d1 = fast ? '3.2s' : '20s'
  const d2 = fast ? '2.8s' : '24s'
  const d3 = fast ? '4.0s' : '28s'
  const d4 = fast ? '3.6s' : '22s'
  const d5 = fast ? '2.4s' : '26s'
  const d6 = fast ? '5.0s' : '30s'
  const ease = fast ? 'cubic-bezier(0.76, 0, 0.24, 1)' : 'ease-in-out'
  const dir = fast ? 'alternate' : 'normal'

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* Lavender — top left */}
      <div
        style={{
          position: 'absolute',
          top: variant === 'process' ? '10%' : '5%',
          left: '-10%',
          width: '55vw',
          height: '55vw',
          maxWidth: '700px',
          maxHeight: '700px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(180,160,230,0.38) 0%, transparent 70%)',
          filter: 'blur(72px)',
          animation: `drift ${d1} ${ease} ${dir} infinite`,
        }}
      />

      {/* Rose — top right */}
      <div
        style={{
          position: 'absolute',
          top: '0%',
          right: '-8%',
          width: '45vw',
          height: '45vw',
          maxWidth: '580px',
          maxHeight: '580px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(240,180,190,0.32) 0%, transparent 70%)',
          filter: 'blur(80px)',
          animation: `drift2 ${d2} ${ease} ${dir} infinite`,
        }}
      />

      {/* Sage green — center */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '30%',
          width: '40vw',
          height: '40vw',
          maxWidth: '520px',
          maxHeight: '520px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(160,210,185,0.28) 0%, transparent 68%)',
          filter: 'blur(90px)',
          animation: `drift ${d3} ${ease} ${dir} infinite reverse`,
        }}
      />

      {/* Sky blue — bottom right */}
      <div
        style={{
          position: 'absolute',
          bottom: variant === 'process' ? '5%' : '10%',
          right: '5%',
          width: '38vw',
          height: '38vw',
          maxWidth: '500px',
          maxHeight: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(160,200,240,0.35) 0%, transparent 70%)',
          filter: 'blur(76px)',
          animation: `drift2 ${d4} ${ease} ${dir} infinite reverse`,
        }}
      />

      {/* Peach — bottom left */}
      <div
        style={{
          position: 'absolute',
          bottom: '0%',
          left: '10%',
          width: '35vw',
          height: '35vw',
          maxWidth: '460px',
          maxHeight: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(245,200,170,0.30) 0%, transparent 70%)',
          filter: 'blur(84px)',
          animation: `drift ${d5} ${fast ? '-1s' : '-8s'} ${ease} ${dir} infinite`,
        }}
      />

      {/* Soft lilac — mid left */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '-5%',
          width: '30vw',
          height: '30vw',
          maxWidth: '400px',
          maxHeight: '400px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(210,185,245,0.25) 0%, transparent 70%)',
          filter: 'blur(88px)',
          animation: `drift2 ${d6} ${fast ? '-2s' : '-14s'} ${ease} ${dir} infinite`,
        }}
      />
    </div>
  )
}
