/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IMAGE_BASE_URL: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_GA_ENABLED: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
