/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API: string
  // add more env variables here as needed
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

