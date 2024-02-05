/** Environment */
export const env = import.meta.env;
/** API endpoint paths */
export const API_PATH = {
    RESOURCES: '/resources',
    NOTES: '/notes',
    AUTH: '/auth',
} as const;
/** React router paths */
export const ROUTER_PATH = {
    NOTES: '/',
} as const;