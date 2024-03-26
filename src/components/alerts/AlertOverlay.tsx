import Alert from "@mui/material/Alert";
import { AlertData, useAlertContext, useAlertDispatch } from "../../contexts/AlertContext"
import { useClock } from "../../hooks/useClock";
import Box from "@mui/material/Box";
import { AlertTitle, Chip } from "@mui/material";

/** Define the delay (in ms) to hide an alert */
const AUTO_HIDE_TRANSITION_START = {
    info: 3000,
    success: 3000,
    warning: 10000,
    error: Number.POSITIVE_INFINITY,
} as const;

/**
 * Format a delay as "now", "x sec ago", or "x min ago"
 */
const formatDelay = (delayInMs: number) => {
    if ( delayInMs < 5_000 ) {
        return "just now"
    }
    
    if ( delayInMs < 60_000 ) {
        return `${ Math.floor(delayInMs / 1_000) * 1}s ago`;
    } else {
        return `${Math.floor(delayInMs / 60_000)}m ago`;
    }
}

/**
 * Overlay to display the alerts.
 * Is using 100% of the parent's space.
 */
export function AlertOverlay() {
    const { alerts } = useAlertContext();
    const dispatch = useAlertDispatch();
    const { date: currentDate } = useClock({ intervalInMs: 1000 })

    const handleCloseAlert = (uuid: AlertData['uuid']) => {
        dispatch({type: "delete", uuid });
    }

    return <Box
            className="pointer-events-none flex flex-col justify-items-end gap-2 p-2"
            sx={{ position: "fixed", zIndex: 100, right: 0, top: 60}}
        >
        {alerts.map( alert => {
            const delayInMs = Math.round( currentDate.diff(alert.date)) ;            
            
            if ( delayInMs > AUTO_HIDE_TRANSITION_START[alert.severity] ) {
                return;
            }
            
            return (
                <MyAlert
                    key={alert.uuid}
                    alert={alert}
                    onClose={handleCloseAlert}
                    delayInMs={delayInMs}
                />)
        })}
    </Box>
}

type MyAlertProps = {
    alert: AlertData;
    onClose: (uuid: AlertData['uuid']) => void;
    delayInMs: number
}

function MyAlert( {alert, onClose: handleCloseAlert, delayInMs}: MyAlertProps) {

    return (
    <Alert        
        className={`p-5 pointer-events-auto cursor-auto w-100`}
        severity={alert.severity}
        onClose={() => handleCloseAlert(alert.uuid)}
    >
        {/** Header */}
        <AlertTitle className="flex gap-5 justify-between items-baseline">
            <h1>{alert.title}</h1>
            {alert.severity == "error" && alert.count > 1 && <Chip label={`x${alert.count}`} variant="outlined" size="small" />}
            <span className="w-auto opacity-25">{formatDelay(delayInMs)}</span>
        </AlertTitle>

        {/** Content */}
        <Box className="flex gap-2 justify-between">
            <p>{alert.message}</p>
        </Box>

    </Alert>
    );
}

