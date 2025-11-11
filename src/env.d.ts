/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CKEDITOR: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
