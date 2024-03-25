import { Box, Button, IconButton, Tooltip } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { useUserContext } from "../../contexts/UserContext";
import { useState } from "react";
import { UserLoginModal } from "./UserLoginModal";
import { useApiClient } from "../../hooks/useApiClient";

/**
 * Displays username and login/logout button depending on user context.
 */
export function UserLoginButton() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const context = useUserContext();
    const api = useApiClient();

    return (
    <Box className="flex gap-2 items-center">
        <Tooltip title={context.statusMessage}>
            <IconButton>
                <PersonIcon />
            </IconButton>
        </Tooltip>        
        {context.user ? 
            < /* Connected */ >
                <span>{context.user.username}</span>
                <Button variant="outlined" onClick={() => api.logout()}>Logout</Button>
            </>
            :
            < /* NOT Connected */>
                <Button variant="outlined" onClick={() => setDialogOpen(true)}>Login</Button>
            </>
        }
        <UserLoginModal open={isDialogOpen} onClose={() => setDialogOpen(false)}/>
    </Box>
    )
}
