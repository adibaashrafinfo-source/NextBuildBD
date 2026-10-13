/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Supabase project URL, e.g. https://xyzcompany.supabase.co */
  readonly VITE_SUPABASE_URL?: string;
  /** Supabase publishable key (sb_publishable_…) or the legacy anon key. Safe to ship to the browser. */
  readonly VITE_SUPABASE_PUBLISHABLE_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
