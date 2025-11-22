interface ImportMetaEnv {
    readonly VITE_BASE_URL: string;
    readonly VITE_STRAPI_BEARER: string;
    readonly VITE_CKEDITOR: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}