export const BASE_URL: string = "http://127.0.0.1:5173";
export const BACKEND_URL: string = "http://127.0.0.1:8000/v1";
/** API endpoint paths */
export const API_PATH = {
    RESOURCES: '/resources',
    NOTES: '/notes',
} as const;
/** React router paths */
export const ROUTER_PATH = {
    NOTES: '/',
} as const;