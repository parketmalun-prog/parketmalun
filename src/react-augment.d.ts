import 'react'

/**
 * React 18's typings predate the priority hint. The attribute is real and
 * understood by every current browser, so it is declared here rather than cast
 * away at the call site. The `import 'react'` above is what makes this a module
 * augmentation instead of a redeclaration of the whole React module.
 */
declare module 'react' {
  interface ImgHTMLAttributes<T> {
    fetchpriority?: 'high' | 'low' | 'auto'
  }
}
