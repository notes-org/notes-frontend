import { api } from '../types/api';
import { API_PATH, env } from "../config";
import axios, { AxiosInstance, AxiosResponse, HttpStatusCode } from 'axios';
import mem from 'mem'; // Memoized
import { User, UserCreate, UserCredentials } from '../types/user';

export class ApiError extends Error {
    reason: any;
    constructor(message: string, reason: any) {
        super(message);
        this.reason = reason;
    }
}


/**
 * Set of function to deal with the backend API.
 * Consider using the hook useApiClient instead, this Api is stateless
 * (except for the access_token which is stored in the local storage).
 */
export namespace ApiClient {

    /** Instantiate an http client with a general configuration */
    // Note: it might be useful to use add interceptors on the client (to transform the response, or the request)
    // TODO: httpClient.defaults.headers.common['Authorization'] = AUTH_TOKEN;
    const httpClient: AxiosInstance = axios.create({
        baseURL: env.VITE_BACKEND_URL,
        headers: {
            "Content-Type": "application/json"            
        }
    })

    /** Function to refresh the JWT Token */
    const refreshTokenFn = async () => {
        try {
            const access_token = localStorage.getItem("access_token")
            const response = await httpClient.post("/auth/token", { access_token });
            if (!response.data?.access_token) {
                localStorage.removeItem("access_token");
            }
            localStorage.setItem("access_token", response.data.access_token);
            return response.data;
        } catch (error) {
            localStorage.removeItem("access_token");            
        }
        return null;
    };

    const memoizedRefreshToken = mem(refreshTokenFn, { maxAge: Number(env.VITE_JWT_MAX_AGE) });

    /** Define an interceptor to insert the authorization header (Bearer ...) */
    httpClient.interceptors.request.use(
        async (config) => {
            // Read session to extract accessToken (if found)
            const access_token = localStorage.getItem("access_token");
            if (access_token) {
                config.headers.authorization = `Bearer ${access_token}`              
            }

            return config;
        },
        (error) => Promise.reject(error)
    );

    /** Define an interceptor to trigger the refresh of the access_token in case
     * an Unauthorized status code is present*/
    httpClient.interceptors.response.use(
        (response) => response,
        async (error) => {
            const config = error?.config;

            if (error?.response?.status === HttpStatusCode.Unauthorized && !config?.sent) {
                config.sent = true;

                const access_token = await memoizedRefreshToken();

                if (access_token) {
                    config.headers.authorization = `Bearer ${access_token}`
                }

                return axios(config);
            }
            return Promise.reject(error);
        }
    );

    /**
     * Create a new user with the provided user information.
     */
    export async function signup(user: UserCreate): Promise<User | null> {
        try {
            await httpClient.post(`${API_PATH.USERS}`, user);
        } catch (error: any) {
            console.error(`Unable to signup`, error)
            return null;
        }   
        return ApiClient.getme();
    }

    /**
     * Get the current user
     */
    export async function getme(): Promise<User | null> {
        try {
            // Note that if it fails, the interceptor might be able to catch it and
            // grab the token from the local storage and retry (see interceptors above)
            const response = await httpClient.get(`${API_PATH.USERS}/me`);
            return response.data
        } catch (error: any) {
            // error skipped on purpose, they are very annoying and http errors can also be seen in the network tab
            return null;
        }
    }

    /**
     * TODO: nothing implemented on the backend side, should be manipulate this token manually on the frontend...?
     */
    export async function logout(): Promise<boolean> {
        localStorage.removeItem("access_token");
        return true;    
    }

    /**
     * Login to the API with a username and a password.
     * If login fail, the promise resolve to false, otherwise it resolve to true.
     * access_token is stored in the local storage as "access_token" and will be automatically
     * injected (see interceptors above)
     */
    export async function login({username, password}: UserCredentials): Promise<User | null> {
        if (!username || !password) {
            throw new Error("Username and/or password is empty or undefined")
        }

        // 1) login to get an updated access_token
        try {
            const response = await httpClient.post(
                `${API_PATH.AUTH}/token`,
                { username, password },
                { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
            );
            localStorage.setItem("access_token", response.data.access_token);
        } catch (error: any) {
            console.error(`Unable to login`, error)
            return null;
        }
        
        // 2) get current user
        return ApiClient.getme();
    }

    /**
     * Create a new Resource for a given URL
     * @param url The url of the Resource.
     * @returns a Resource or null if it fails
     */
    export async function createResource(url: api.Resource['url']): Promise<api.Resource | null> {
        try {
            const response = await internal.createResource(url);
            return response.data;
        } catch (error: any) {
            console.error(`Unable to createResource`, error)
            return null;
        }
    }

    /**
     * Create a new Note related to a given Resource
     * @param note   The Note to create.
     * @param url    The URL of the related Resource.
     */
    export async function createNote(note: api.NotePOST, resource: api.Resource): Promise<api.Note | null> {
        try {
            const response = await internal.createNote(note, resource);
            return response.data;
        } catch (error: any) {
            console.error(`Unable to createNote`, error)
            return null;
        }
    }

    /**
     * Get all the notes related to a given Resource
     * @param url   The url of the related Resource. If not set, all notes will be returned
     */
    export async function getNotes(resource: api.Resource): Promise<api.Note[] | null> {
        try {
            const response = await internal.getNotes(resource);
            return response.data;
        } catch (error: any) {
            console.error(`Unable to getNotes`, error)
            return null;
        }
    }

    /**
     * Get a given Resource from a URL
     * @param url The url of the Resource.
     * @returns a Resource or null if it fails
     */
    export async function getResource(url: string): Promise<api.Resource | null> {
        try {
            const response = await internal.getResource(url);
            return response.data;
        } catch (error: any) {
            console.error(`Unable to getResource`, error)
            return null;
        }
    }


    /**
     * Get or create a Resource from a given URL
     * @param url The url of the resource
     * @returns a Resource or null if it fails
     */
    export async function getOrCreateResource(url: string): Promise<api.Resource | null> {

        // First, we try to get the resource (may exist)
        try {
            console.debug(`Try to get the resource ... (url: '${url}')`);
            const response = await internal.getResource(url);
            return response.data;
        } catch (error: any ) {    
            // The only error we allow is a 404, otherwize we return a null
            if (!error.response || error.response.status !== HttpStatusCode.NotFound) {
                console.error('Unable to get the resource', error)
                return null;                          
            }
        }

        // If we're here, that's because we just got a 404 above, let's try to create the resource now
        try {
            console.debug(`Couldn't get the resource, try to create ... (url: '${url}')`);
            const response = await internal.createResource(url);
            return response.data;
        } catch (error: any) {
            // The only error we allow is 409, it signify an other user created the same resource (race condition)
            if (!error.response || error.response.status !== HttpStatusCode.Conflict) {
                console.error('Unable to create the resource', error)
                return null;            
            }
        }

        // If we're here, that's because we just got a 409 above, so we need to fetch again.
        try {
            const response = await internal.getResource(url);
            return response.data;
        } catch (error: any) {
            console.error(`Unable to getOrCreateResource`, error);
            return null;
        }
    }

    /**
     * Methods reserved for internal use. They serve as shortcut to use the httpClient
     * Those functions return as-is the Promise<AxiosResponse<T>> object returned by the AxiosInstance.
     */
    export namespace internal {

        export function createNote(note: api.NotePOST, resource: api.Resource): Promise<AxiosResponse<api.Note>> {
            const _note = {
                content: JSON.stringify(note.content) // TODO: allow an object instead of string on the backend API? Would be symetric
            };
            return httpClient.post(API_PATH.NOTES, _note, { params: { url: resource.url }} );
        }

        export function getResource(url: string): Promise<AxiosResponse<api.Resource>> {
            return httpClient.get(API_PATH.RESOURCES, { params: { url } });
        }

        export function createResource(url: api.Resource['url']): Promise<AxiosResponse<api.Resource>> {
            return httpClient.post(API_PATH.RESOURCES, null, { params: { url } });
        }

        export function getNotes(resource: api.Resource): Promise<AxiosResponse<api.Note[]>> {
            return httpClient.get(API_PATH.NOTES, { params: { url: resource.url } });
        }
    }
}
