import { Dispatch, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { User } from '../types/user';

export enum Status {
  IDLE = 0,
  CONNECTION_IN_PROGRESS,
  CONNECTED
}

type State = {
  /** The currently connected user, user is null except when status is CONNECTED */
  user: User | null;
  /** User's status as an enumeration */
  status: Status;
  /** User's status as a string */
  statusMessage: string;
  /** Last error message, may be cleared by an Action dispatch */
  errorMessage?: string;
}

type Action = { type: 'loggedIn', user: User }
            | { type: 'loggedOut' }
            | { type: 'logging' }
            | { type: 'reset' }
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

export function useUserContext(): State {
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
    case 'reset': {
      return {
        ...initialState
      }
    }
    case 'error': {
        return {
            ...state,
            errorMessage: action.message
        }
    }
    case 'logging': {
        return {
            ...state,
            status: Status.CONNECTION_IN_PROGRESS,
            statusMessage: 'Logging...'
        }
    }
    case 'loggedIn': {
        console.debug(`${action.user.username} is now logged in`)
        return {
          user: action.user,
          status: Status.CONNECTED,
          statusMessage: "Successfully Connected"
        };
    }
    case 'loggedOut': {
      if ( state.user === null || state.status !== Status.CONNECTED ) {
        throw new Error("Unable to logout, no user is currently logged.")
      }
      console.debug(`${state.user.username} is now logged out`)
      return {
        user: null,
        status: Status.IDLE,
        statusMessage: "Logged out"
      };
    }
    default:
        const _action: never = action; // To fail at compile time
        throw new Error(`Unable to handle the action ${JSON.stringify(_action)}`); // To fail at run time
  }
}

const initialState: State = {
    user: null,
    status: Status.IDLE,
    statusMessage: 'Not connected',
}