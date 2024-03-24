import { useCallback, useEffect } from "react";
import { Status, useUserContext, useUserDispatch } from "../contexts/UserContext";
import { User, UserCreate, UserCredentials } from "../types/user";
import { ApiClient } from "../utils/ApiClient";
import { useAlertDispatch } from "../contexts/AlertContext";

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
                const user = await ApiClient.getme();
                if ( user ) {
                    console.debug("Automatic getme() success", user)
                    alertDispatch({type: 'push', alert: { message: `Hi ${user.username}, welcome back!`, title: 'Logged', severity: 'success' }})
                    userDispatch({ type: "loggedIn", user })
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
        const user = await ApiClient.signup(userCreate);
        if ( user ) {
            alertDispatch({type: 'push', alert: { message: 'Successfully signed up', title: 'Logged', severity: 'success' }})
            userDispatch({ type: 'loggedIn', user })
        } else {
            alertDispatch({type: 'push', alert: { message: 'Unable to sign up.', title: 'Logged', severity: 'error' }})
        }
        return user;
    }, [context])

    /**
     * Login using credentials and update user context accordingly
     */
    const login = useCallback( async (credentials: UserCredentials): Promise<User | null> => {
        userDispatch({ type: 'logging' })
        const user = await ApiClient.login(credentials);
        if ( user ) {
            alertDispatch({type: 'push', alert: { message: 'Successfully logged', title: 'Logged', severity: 'success' }})
            userDispatch({ type: 'loggedIn', user }) 
            alertDispatch({type: 'push', alert: { message: 'Wrong credentials', title: 'Logged', severity: 'error' }})
        }
        return user;     
    }, [context])
    
    /**
     * Logout using credentials and update user context accordingly
     */
    const logout = useCallback( async (): Promise<boolean> => {
        if ( context.status !== Status.CONNECTED ) {
            console.warn(`Unable to logout, no user is currently connected`)
            return false;
        }
        const success = await ApiClient.logout();
        if ( success ) {
            alertDispatch({type: 'push', alert: { message: 'Successfully logged', title: 'Logged', severity: 'info' }})
            userDispatch({ type: 'loggedOut' })
        } else {
            alertDispatch({type: 'push', alert: { message: 'Unable to log out', title: 'Logged', severity: 'error' }})
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