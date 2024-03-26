import moment, { Moment } from 'moment';
import { Dispatch, PropsWithChildren, createContext, useContext, useReducer } from 'react';
import { v4 as uuid } from 'uuid';

export type AlertData = {
    /** Alert unique identifier */
    uuid: string;  
    date: Moment;
    severity: 'success' | 'info' | 'warning' | 'error'; // Matches with mui's alert's
    title: string;
    message: string;
    count: number;
}

type State = {
  /** The last alert (sorted from recent to older) */
  alerts: Array<AlertData>;
  /** Alert history length (default is 10) */
  maxHistoryLength: number;
}

const initialState: State = {
  alerts: [],
  maxHistoryLength: 10
}

type Action = { type: 'push', alert: Omit<AlertData, 'uuid' | 'date' | 'count'> }
            | { type: 'delete', uuid: AlertData['uuid'] }
            
const Context = createContext<State | null>(null);

const DispatchContext = createContext<Dispatch<Action> | null>(null);

export function AlertProvider({ children }: PropsWithChildren) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  return (
    <Context.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </Context.Provider>
  );
}

export function useAlertContext(): State {
  const context = useContext(Context);
  if ( context == null) throw new Error("Unable to use AlertContext, did you wrapped this component in a AlertProvider?");
  return context;
}

export function useAlertDispatch(): Dispatch<Action> {
  const dispatch = useContext(DispatchContext);
  if ( dispatch == null) throw new Error("Unable to use AlertDispatchContext, did you wrapped this component in a AlertProvider?");
  return dispatch;
}

function userReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'push': {

      // If a similar alert exists, we replace it with update values
      if ( state.alerts.length > 0) {
        const last = state.alerts[0];
        if ( last.severity === action.alert.severity && last.title === action.alert.title && last.message === action.alert.message ) {
          const newAlerts = [...state.alerts];
          newAlerts[0] = {
            ...last,
            date: moment(),
            count: last.count + 1
          }
          return {
            ...state,
            alerts: newAlerts
          }        
        }
      }

      // Insert it first
      const newAlert: AlertData = {
        ...action.alert,
        uuid: uuid(),
        date: moment(),
        count: 1
      };

      return {
          ...state,
          alerts: [newAlert, ...state.alerts.slice(0, state.maxHistoryLength-1) ] // New alert + 9 older
      }
    }
    case "delete": {
      return {
        ...state,
        alerts: state.alerts.filter( _alert => _alert.uuid !== action.uuid )
      }
    }
  }  
}
