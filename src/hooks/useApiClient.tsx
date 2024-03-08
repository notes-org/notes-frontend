import { useCallback, useEffect } from "react";
import { useUserContext, useUserDispatch } from "../contexts/UserContext";
import { UserCreate, UserCredentials } from "../types/user";
import { ApiClient } from "../utils/ApiClient";

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
    const dispatch = useUserDispatch();

    /** Query users/me in case user context state is disconnected */
    useEffect( () => {
        async function fetch() {
            if ( !context.isLogged ) {
                console.debug("Automatic getme()...")
                const _user = await ApiClient.getme();
                if ( _user ) {
                    console.debug("Automatic getme() success", _user)
                    dispatch({ type: "loggedIn", username: _user.username })
                }
            }
        }
        fetch();
    }, [])

    /**
     * Sign up using credentials and update user context accordingly
     */
    const signup = useCallback( async (userCreate: UserCreate): Promise<boolean> => {
        const success = await ApiClient.signup(userCreate);
        if ( success ) {
            dispatch({ type: 'loggedIn', username: userCreate.username})
        } else {
            dispatch({ type: 'error', message: "Unable to sign up"})
        }
        return success;
    }, [context])

    /**
     * Login using credentials and update user context accordingly
     */
    const login = useCallback( async (credentials: UserCredentials): Promise<boolean> => {
        const success = await ApiClient.login(credentials);
        if ( success ) {
            dispatch({ type: 'loggedIn', username: credentials.username})
        } else {
            dispatch({ type: 'error', message: "Unable to log in"})
        }
        return success;     
    }, [context])
    
    /**
     * Logout using credentials and update user context accordingly
     */
    const logout = useCallback( async (): Promise<boolean> => {
        if ( context.isLogged == null || context.username == null) {
            console.warn(`Unable to logout, no user is currently connected`)
            return false;
        }
        const success = await ApiClient.logout();
        if ( success ) {
            dispatch({ type: 'loggedOut' })
        } else {
            dispatch({ type: 'error', message: "Unable to log out"})
        }
        return success;     
    }, [context])
    
    const createNote = ApiClient.createNote; // TODO: create a NoteContext to store the current Resource with its Notes
    const getOrCreateResource = ApiClient.getOrCreateResource; // same

    return {
        signup,
        login,
        logout,
        createNote,
        getOrCreateResource,
    }
}