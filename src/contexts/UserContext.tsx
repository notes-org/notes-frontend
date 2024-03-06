import { Dispatch, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { UserCredentials } from '../types/user';

type State = {
    username: string | null;
    isLogged: boolean;
    status: string;
}

type Action = { type: 'loggedIn', username: UserCredentials['username'] }
            | { type: 'loggedOut' }
            | { type: 'logging' }
            | { type: 'error', message: string }
            
const Context = createContext<State | null>(null);

const DispatchContext = createContext<Dispatch<Action> | null>(null);

/**
 * Provide user context to children.
 * Use: useUser() and useUserDispatch() to despectively get and mutate the user state.
 */
export function UserProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </Context.Provider>
  );
}

export function useUser(): State {
  const context = useContext(Context);
  if ( context == null) throw new Error("Unable to use UserContext, did you wrapped this component in a UserProvider?");
  return context;
}

export function useUserDispatch(): Dispatch<Action> {
  const dispatch = useContext(DispatchContext);
  if ( dispatch == null) throw new Error("Unable to use UserDispatchContext, did you wrapped this component in a UserProvider?");
  return dispatch;
}

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'error': {
        return {
            ...state,
            status: action.message
        }
    }
    case 'logging': {
        return {
            ...state,
            status: 'Logging...'
        }
    }
    case 'loggedIn': {
        console.debug(`${action.username} is now logged in`)
        return {
            username: action.username,
            isLogged: true,
            status: "Successfully Connected"
        };
    }
    case 'loggedOut': {
        console.debug(`${state.username} is now logged out`)
        return {
            username: null,
            isLogged: false,
            status: "Logged out"
          };
    }
    default:
        const _action: never = action; // To fail at compile time
        throw new Error(`Unable to handle the action ${JSON.stringify(_action)}`); // To fail at run time
  }
}

const initialState: State = {
    username: null,
    isLogged: false,
    status: 'Not connected'
}