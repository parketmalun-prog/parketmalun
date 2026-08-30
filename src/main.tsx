import React, { lazy } from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { markHydrated } from './components/motionPrimitives'
import { pageKeyFor, pageLoaders } from './pageLoaders'
import type { PageKey, PageMap } from './routes'
// Self-hosted variable fonts. Fraunces is the display cut (client's call,
// 24.08, reference surrenne.com): an elegant high-contrast serif carried by
// its optical-size axis, so the big statements read as editorial headlines.
// Space Grotesk stays on every UI/body size; the italic display cut loads
// lazily and only serves the accent words.
// Fraunces ships as unicode-range slices, which cost a Polish visitor two
// files and 124 kB before a heading painted. These are our own subsets:
// one 23.7 kB upright and one 14.6 kB italic, both covering is/en/pl.
import './styles/fonts/fraunces.css'
import './styles/fonts/fraunces-italic-subset.css'
import '@fontsource-variable/space-grotesk/index.css'
import './index.css'

const KEYS = Object.keys(pageLoaders) as PageKey[]

function lazyPages(): PageMap {
  const map = {} as PageMap
  for (const key of KEYS) map[key] = lazy(pageLoaders[key])
  return map
}

async function start() {
  const container = document.getElementById('root')!
  const prerendered = Boolean(container.firstElementChild)
  const pages = lazyPages()

  // Resolve the page being hydrated up front so React never suspends on it.
  if (prerendered) {
    const key = pageKeyFor(window.location.pathname)
    try {
      pages[key] = (await pageLoaders[key]()).default
    } catch {
      // A failed chunk fetch falls back to the lazy component, which will show
      // the Suspense placeholder and retry rather than leave a blank page.
    }
  }

  const app = (
    <React.StrictMode>
      <BrowserRouter>
        <App pages={pages} />
      </BrowserRouter>
    </React.StrictMode>
  )

  if (prerendered) {
    ReactDOM.hydrateRoot(container, app)
    // From here on, anything newly mounted animates in as usual.
    requestAnimationFrame(markHydrated)
  } else {
    ReactDOM.createRoot(container).render(app)
  }
}

void start()
