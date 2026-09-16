import { useSyncExternalStore } from 'react'

const QUERY = '(hover: hover) and (pointer: fine)'

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(QUERY)
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getSnapshot() {
  return window.matchMedia(QUERY).matches
}

/**
 * True when the device has a real pointer that can hover.
 *
 * Touch screens fire hover on tap, so anything hover-driven has to be gated on
 * this rather than assumed. `useSyncExternalStore` is the right primitive here:
 * matchMedia is an external store, and subscribing through it avoids the
 * setState-in-effect cascade a useState/useEffect pair would cause.
 */
export default function useFinePointer(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
