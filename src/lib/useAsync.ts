import { useCallback, useEffect, useState } from 'react'
import type { DependencyList } from 'react'
import { onChange } from './db'
import type { Topic } from './db'

type State<T> = { data: T | null; loading: boolean; error: string | null }

/**
 * Loads async data and keeps it fresh.
 *
 * Pass `watch` to re-run whenever that topic is written anywhere in the app,
 * which is how an open admin list updates itself after a save in a dialog.
 *
 * Pass `seed` to start with data already in hand. The prerender step needs
 * this: rendering happens in one synchronous pass, so a page that waits on a
 * promise would be written to disk as a loading dot. With a seed the page
 * renders its real content at build time and refreshes from storage on the
 * client.
 */
export function useAsync<T>(
  loader: () => Promise<T>,
  deps: DependencyList,
  watch?: Topic,
  seed?: T,
) {
  const [state, setState] = useState<State<T>>(
    seed === undefined
      ? { data: null, loading: true, error: null }
      : { data: seed, loading: false, error: null },
  )
  const [nonce, setNonce] = useState(0)

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  useEffect(() => {
    let alive = true
    // Keep whatever is already on screen while refreshing, so a seeded page
    // does not flash back to its loading state.
    setState((s) => ({ ...s, loading: s.data === null }))
    loader().then(
      (data) => {
        if (alive) setState({ data, loading: false, error: null })
      },
      (error: unknown) => {
        if (alive) {
          setState({ data: null, loading: false, error: error instanceof Error ? error.message : String(error) })
        }
      },
    )
    return () => {
      alive = false
    }
    // The loader is intentionally not a dependency: callers pass an inline
    // closure, and `deps` is the list they actually want to react to.
  }, [...deps, nonce]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!watch) return
    return onChange((topic) => {
      if (topic === watch) reload()
    })
  }, [watch, reload])

  return { ...state, reload }
}
