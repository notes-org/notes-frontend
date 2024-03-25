import { UserLoginForm, UserLoginFormProps } from "./UserLoginForm";
import { Box, Dialog } from "@mui/material";

type Props = {
    open: boolean;
    onClose: () => void;
}

/**
 * Wraps UserLoginForm in a Dialog.
 * Implements the minimal functionnalities missing from UserLoginForm to act like a Dialog.
 */
export function UserLoginModal(props: Props) {

    /** Closes modal when user is logged */
    const handleUserLogged: UserLoginFormProps['onLogged'] = ({user}) => {
        // User is null when login failed
        if ( user !== null ) {
            props.onClose()
        }
    }

    return (
        <Dialog {...props}>
            <Box sx={{ width: 350 }}>
                <UserLoginForm onLogged={handleUserLogged} />
            </Box>
        </Dialog>
    )
}