import { api } from '../types/api';
import { HttpClient, HttpClientResponse } from './HttpClient';
import { API_PATH } from "../config";

export class ApiError extends Error {
    reason: any;
    constructor(message: string, reason: any) {
        super(message);
        this.reason = reason;
    }
}


/**
 * Set of function to deal with the backend API.
 */
export namespace ApiClient {

    /**
     * Create a new Resource for a given URL
     * @param url The url of the Resource.
     * @returns a Resource or null if it fails
     */
    export async function createResource(url: api.Resource['url']): Promise<api.Resource | null> {
        let response = await internal.createResource(url);
        if (response.ok) return response.body;
        console.error(`Unable to createResource`, response)
        return null;
    }

    /**
     * Create a new Note related to a given Resource
     * @param note   The Note to create.
     * @param url    The URL of the related Resource.
     */
    export async function createNote(note: api.NotePOST, resource: api.Resource): Promise<api.Note | null> {
        let response = await internal.createNote(note, resource);
        if (response.ok) return response.body;
        console.error(`Unable to createNode`, response)
        return null;
    }

    /**
     * Get all the notes related to a given Resource
     * @param url   The url of the related Resource. If not set, all notes will be returned
     */
    export async function getNotes(resource: api.Resource): Promise<api.Note[] | null> {
        let response = await internal.getNotes(resource);
        if (response.ok) return response.body;
        console.error(`Unable to getNotes`, response)
        return null;
    }

    /**
     * Get a given Resource from a URL
     * @param url The url of the Resource.
     * @returns a Resource or null if it fails
     */
    export async function getResource(url: string): Promise<api.Resource | null> {
        let response = await internal.getResource(url);
        if (response.ok) return response.body;
        console.error(`Unable to getResource`, response)
        return null;
    }


    /**
     * Get or create a Resource from a given URL
     * @param url The url of the resource
     * @returns a Resource or null if it fails
     */
    export async function getOrCreateResource(url: string): Promise<api.Resource | null> {

        // Try to get
        console.debug(`Get the resource ... (url: '${url}')`);
        let get_response = await internal.getResource(url);
        if (get_response.ok) return get_response.body;

        if (get_response.status == 404) {

            // Try to create          
            console.debug(`Couldn't get the resource, try to create ... (url: '${url}')`);
            let post_response = await internal.createResource(url);
            if (post_response.ok) return post_response.body;

            // Handle race condition (an other user might have create the same Resource after the GET and before the POST)
            if (post_response.status === 409) {
                let get_response = await internal.getResource(url);
                if (get_response.ok) return get_response.body;
            }
        }

        console.error(`Unable to getOrCreateResource (url: '${url}')`);
        return null;
    }

    /**
     * Methods reserved for internal use.
     * Those functions return as-is the HttpClientResponse<T> object returned by the HttpClient.
     */
    export namespace internal {

        export async function createNote(note: api.NotePOST, resource: api.Resource): Promise<HttpClientResponse<api.Note>> {
            try {
                const response = await HttpClient.requestAPI<api.Note>("POST", `${API_PATH.NOTES}?url=${resource.url}`, JSON.stringify(note));
                return response;
            } catch (error: any) {
                throw new ApiError(`Unable to createNote (url: '${resource.url}')`, error);
            }
        }

        export async function getResource(url: string): Promise<HttpClientResponse<api.Resource>> {
            try {
                const response = await HttpClient.requestAPI<api.Resource>('GET', `${API_PATH.RESOURCES}?url=${url}`);
                return response;
            } catch (error) {
                throw new ApiError(`Unable to getResource (url: '${url}')`, error);
            }
        }

        export async function createResource(url: api.Resource['url']): Promise<HttpClientResponse<api.Resource>> {
            try {
                const response = await HttpClient.requestAPI<api.Resource>("POST", `${API_PATH.RESOURCES}?url=${url}`);
                return response;
            } catch (error) {
                throw new ApiError(`Unable to createResource (url: '${url}')`, error);
            }
        }

        export async function getNotes(resource: api.Resource): Promise<HttpClientResponse<api.Note[]>> {
            try {
                const response = await HttpClient.requestAPI<api.Note[]>('GET', resource ? `${API_PATH.NOTES}?url=${resource.url}` : API_PATH.NOTES);
                return response;
            } catch (error) {
                throw new ApiError(`Unable to getNotes (url: '${resource.url}')`, error);
            }
        }
    }
}