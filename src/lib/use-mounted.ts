import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

/**
 * True only after hydration. Use it to render values that come from
 * persisted stores (cart / wishlist counts) without hydration mismatches.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  )
}
