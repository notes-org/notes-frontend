import MuiAlert from "@mui/material/Alert";
import { AlertData, useAlertContext, useAlertDispatch } from "../../contexts/AlertContext"

/**
 * Overlay to display the alerts.
 * Is using 100% of the parent's space.
 */
export function AlertOverlay() {
    const context = useAlertContext();
    const dispatch = useAlertDispatch();

    const handleCloseAlert = (alert: AlertData) => {
        dispatch({type: "delete", alert: alert });
    }

    return <div
        className="pointer-events-none flex flex-col justify-items-end gap-2 p-2"
        style={{ position: "fixed", zIndex: 100, right: 0, bottom: 0 }}
        >
        {context.alerts.map( alert => {
            return <Alert
                alert={alert}
                onClose={handleCloseAlert} />
        })}
    </div>
}

type AlertProps = {
    onClose: (alert: AlertData) => void;
    alert: AlertData;
}

function Alert({onClose, alert}: AlertProps) {
    return (
    <MuiAlert
        className="p-5 pointer-events-auto cursor-pointer"
        severity={alert.severity}
        onClick={() => onClose(alert)}
    >
        {alert.message}
    </MuiAlert>
    )
}