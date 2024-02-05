/// <reference types="vite/client" />

interface ImportMetaEnv {

    readonly VITE_BACKEND_URL: string;
    readonly VITE_JWT_MAX_AGE: string;
    /** Temporary username to login with automatically */
    readonly VITE_USERNAME: string; 
    /** Temporary password to login with automatically  */
    readonly VITE_PASSWORD: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}