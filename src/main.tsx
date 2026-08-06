import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { LazyMotion, domAnimation, MotionConfig } from 'framer-motion'
import App from './App'
// Self-hosted variable fonts. Fraunces ships the opsz axis (needed for the
// display cut at hero sizes); Space Grotesk carries every UI/body weight in
// one file. Both css files include latin + latin-ext unicode-range subsets.
import '@fontsource-variable/fraunces/opsz.css'
import '@fontsource-variable/fraunces/opsz-italic.css'
import '@fontsource-variable/space-grotesk/index.css'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {/* domAnimation = the smaller framer-motion feature set (no drag/layout);
        reducedMotion="user" makes every animation honour the OS setting. */}
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </MotionConfig>
    </LazyMotion>
  </React.StrictMode>,
)
