/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL. Set both Supabase vars to move off browser storage. */
  readonly VITE_SUPABASE_URL?: string
  readonly VITE_SUPABASE_ANON_KEY?: string
  /**
   * SHA-256 of the admin password. Required in production: without it the
   * panel has no working password at all. The fallback hash in auth.ts is
   * compiled out of anything that ships and only unlocks a local dev server.
   */
  readonly VITE_ADMIN_PASSWORD_HASH?: string
  /** Address the sign-in screen expects. Defaults to verk@expertparket.is. */
  readonly VITE_ADMIN_EMAIL?: string
  /** Overrides the translation endpoint. Defaults to /api/translate. */
  readonly VITE_TRANSLATE_ENDPOINT?: string
  /** Shared token sent to the translation endpoint when it requires one. */
  readonly VITE_ADMIN_API_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
