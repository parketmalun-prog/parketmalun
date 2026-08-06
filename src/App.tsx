import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import type { Lang } from './i18n/config'
import { LanguageProvider } from './i18n/context'
import { Layout } from './components/Layout'

// Route-level code splitting: each page ships as its own chunk (loaded on
// demand via the <Suspense> boundary in Layout), so the first paint no longer
// downloads every route's code and per-language data up front.
const Home = lazy(() => import('./pages/Home'))
const Services = lazy(() => import('./pages/Services'))
const Portfolio = lazy(() => import('./pages/Portfolio'))
const Catalog = lazy(() => import('./pages/Catalog'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Privacy = lazy(() => import('./pages/Privacy'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Wraps the shared layout in a language context for one URL-prefix group. */
function LangShell({ lang }: { lang: Lang }) {
  return (
    <LanguageProvider lang={lang}>
      <Layout />
    </LanguageProvider>
  )
}

export default function App() {
  return (
    <Routes>
      {/* Icelandic: primary language, no URL prefix */}
      <Route path="/" element={<LangShell lang="is" />}>
        <Route index element={<Home />} />
        <Route path="thjonusta" element={<Services />} />
        <Route path="verkefni" element={<Portfolio />} />
        <Route path="parket" element={<Catalog />} />
        <Route path="um-okkur" element={<About />} />
        <Route path="hafdu-samband" element={<Contact />} />
        <Route path="personuvernd" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* English */}
      <Route path="/en" element={<LangShell lang="en" />}>
        <Route index element={<Home />} />
        <Route path="services" element={<Services />} />
        <Route path="projects" element={<Portfolio />} />
        <Route path="flooring" element={<Catalog />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Contact />} />
        <Route path="privacy" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Polish */}
      <Route path="/pl" element={<LangShell lang="pl" />}>
        <Route index element={<Home />} />
        <Route path="uslugi" element={<Services />} />
        <Route path="realizacje" element={<Portfolio />} />
        <Route path="parkiety" element={<Catalog />} />
        <Route path="o-nas" element={<About />} />
        <Route path="kontakt" element={<Contact />} />
        <Route path="polityka-prywatnosci" element={<Privacy />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
