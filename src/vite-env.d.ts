/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE?: string
  readonly VITE_R2_DB_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.wasm?url' {
  const src: string
  export default src
}
