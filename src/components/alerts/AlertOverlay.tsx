import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import { AlertData, useAlertContext, useAlertDispatch } from "../../contexts/AlertContext"
import { useClock } from "../../hooks/useClock";
import Box from "@mui/material/Box";
import { Chip } from "@mui/material";
import moment from "moment";

/** Define the delay (in ms) to hide an alert */
const AUTO_HIDE_DELAY = {
    info: 3000,
    success: 3000,
    warning: 10000,
    error: Number.POSITIVE_INFINITY,
} as const;

/** Delay to show "X sec ago" */
const X_SECONDS_AGO_DELAY = 3000;

/**
 * Overlay to display the alerts.
 * Is using 100% of the parent's space.
 */
export function AlertOverlay() {
    const context = useAlertContext();
    const dispatch = useAlertDispatch();
    const { date: currentDate } = useClock({ intervalInMs: 1000 })

    const handleCloseAlert = (uuid: AlertData['uuid']) => {
        dispatch({type: "delete", uuid });
    }

    return <div
            className="pointer-events-none flex flex-col justify-items-end gap-2 p-2"
            style={{ position: "fixed", zIndex: 100, right: 0, bottom: 0 }}
        >
        {context.alerts
                .map( alert => {
            const delayInMs = Math.round( currentDate.diff(alert.date)) ;
            
            if ( delayInMs > AUTO_HIDE_DELAY[alert.severity] ) {
                return <></>
            }

            return (
                <Alert
                    key={alert.uuid}
                    className="p-5 pointer-events-auto cursor-pointer"
                    severity={alert.severity}
                    onClose={() => handleCloseAlert(alert.uuid)}
                >
                    <AlertTitle className="flex gap-1 justify-between">
                        {alert.title}
                        {alert.count > 1 && <Chip label={`${alert.count} times`} size="small"/>}
                    </AlertTitle>
                    <Box className="flex flex-col gap-1">
                        <Box>{alert.message}</Box>
                        { delayInMs >= X_SECONDS_AGO_DELAY &&
                        <Box className="opacity-25">
                            {moment().millisecond(delayInMs).format("s [sec ago]")}
                        </Box>}
                    </Box>
                </Alert>
            )
        })}
    </div>
}
