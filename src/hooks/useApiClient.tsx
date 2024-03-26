import { useCallback, useEffect } from "react";
import { Status, useUserContext, useUserDispatch } from "../contexts/UserContext";
import { User, UserCreate, UserCredentials } from "../types/user";
import { ApiClient, ApiError } from "../utils/ApiClient";
import { useAlertDispatch } from "../contexts/AlertContext";
import { api } from "../types/api";

/**
 * Wraps ApiClient functions as a React hook.
 * Each call may have a side effect on UserContext.
 * 
 * ReactComponent <----> useApiClient <-----> ApiClient <-----> API
 *        ^                     v
 *        |                     |
 *        ----- UserContext <----
 * 
 * Consider bringing new functionality here by calling ApiClient's functions.
 * But, implement the maximum as pure functions in ApiClient instead of here.
 */
export function useApiClient() {
    const context = useUserContext();
    const userDispatch = useUserDispatch();
    const alertDispatch = useAlertDispatch();

    /** Query users/me in case user context state is disconnected */
    useEffect( () => {
        async function fetch() {
            if ( context.status === Status.IDLE ) {
                console.debug("Automatic getme()...")
                try {
                    const user = await ApiClient.getme();
                    alertDispatch({type: 'push', alert: { message: `Hi ${user.username}, welcome back!`, title: 'Authentication', severity: 'info' }})
                    userDispatch({ type: "loggedIn", user })
                } catch( error: any | ApiError) {
                    console.debug(error.message); // Silent, to fail automatic getme is not an issue
                }
            }
        }
        fetch();
    }, [])

    /**
     * Sign up using credentials and update user context accordingly
     */
    const signup = useCallback( async (userCreate: UserCreate): Promise<User | null> => {
        userDispatch({ type: 'logging' })
        try {
            const user = await ApiClient.signup(userCreate);
            alertDispatch({type: 'push', alert: { message: 'Successfully signed up', title: 'Authentication', severity: 'success' }})
            userDispatch({ type: 'loggedIn', user })
            return user;
        } catch( error: any | ApiError ) {
            alertDispatch({type: 'push', alert: { message: error.message, title: 'Authentication', severity: 'error' }})
            return null;
        }
    }, [alertDispatch, userDispatch])

    /**
     * Login using credentials and update user context accordingly.
     * Alerts may be pushed as side effect when user is logged or when an error occured.
     */
    const login = useCallback( async (credentials: UserCredentials): Promise<User | null> => {
        userDispatch({ type: 'logging' })
        
        try {
            const user = await ApiClient.login(credentials);           
            userDispatch({ type: 'loggedIn', user })     
            alertDispatch({type: 'push', alert: { message: 'Successfully logged', title: 'Authentication', severity: 'success' }})        
            return user;
        } catch (error: any) {
            alertDispatch({type: 'push', alert: { message: error.message, title: 'Authentication', severity: 'error' }})
            return null;
        }    
    }, [context, alertDispatch, useAlertDispatch])
    
    /**
     * Logout using credentials and update user context accordingly
     */
    const logout = useCallback( async (): Promise<Status> => {
        if ( context.status !== Status.CONNECTED ) {
            console.warn(`Unable to logout, no user is currently connected`)
            return context.status;
        }
        try {
            await ApiClient.logout();
            alertDispatch({type: 'push', alert: { message: 'Successfully logged out', title: 'Authentication', severity: 'info' }})
            userDispatch({ type: 'loggedOut' });
            return Status.IDLE;
        } catch( error: any | ApiError) {
            alertDispatch({type: 'push', alert: { message: error.message, title: 'Authentication', severity: 'error' }})
            return context.status;
        }   
    }, [context, alertDispatch, userDispatch])

    /**
     * Create a new note on a given resource
     */
    const createNote = useCallback( async (note: api.NotePOST, resource: api.Resource): Promise<api.Note | null> => {
        
        // Is it necessary to check if user is logged and return early here? Instead, I rely on API's response.

        try {
            const newNote = await ApiClient.createNote(note, resource);
            return newNote;
        } catch( error: any | ApiError) {
            alertDispatch({type: 'push', alert: { message: error.message, title: 'Create Note', severity: 'error' }})
            return null;
        }  
    }, [alertDispatch])

    /**
     * Get or create a resource from a given url
     */
    const getOrCreateResource = useCallback( async (url: string): Promise<api.Resource | null> => {
        try {
            const resource = await ApiClient.getOrCreateResource(url);
            return resource;
        } catch( error: any | ApiError) {
            alertDispatch({type: 'push', alert: { message: error.message, title: 'Get Or Create Resource', severity: 'error' }})
            return null;
        }   
    }, [alertDispatch])

    return {
        signup,
        login,
        logout,
        createNote,
        getOrCreateResource,
    }
}