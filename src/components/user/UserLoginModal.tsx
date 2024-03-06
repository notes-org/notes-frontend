import { UserLoginForm } from "./UserLoginForm";
import { Box, Dialog } from "@mui/material";

type Props = {
    open: boolean;
    onClose: () => void;
}

/**
 * Wraps UserLoginForm in a Modal
 */
export function UserLoginModal(props: Props) {
    return (
        <Dialog {...props}>
            <Box sx={{ width: 350 }}>
                <UserLoginForm onLogged={props.onClose}/>
            </Box>
        </Dialog>
    )
}