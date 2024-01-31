/// <reference types="vite/client" />

interface ImportMetaEnv {

    // Note: vars are starting with VITE_, otherwise the builder do not include them in prod.

    readonly VITE_BASE_URL: string;
    readonly VITE_BACKEND_URL: string;
    readonly VITE_JWT_MAX_AGE: string;

    // Those are not supposed to be included in prod, that's why there is no prefix VITE_
    
    readonly USERNAME: string;
    readonly PASSWORD: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}