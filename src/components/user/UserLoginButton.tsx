import { Box, Button, IconButton, Tooltip } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { useUser, useUserDispatch } from "../../contexts/UserContext";
import { MouseEventHandler, useState } from "react";
import { UserLoginModal } from "./UserLoginModal";
import { ApiClient } from "../../utils/ApiClient";

export function UserLoginButton() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const user = useUser();
    const dispatch = useUserDispatch();
    
    const handleLogin: MouseEventHandler = async () => {        
        setDialogOpen(true);
    }

    const handleLogout: MouseEventHandler = async () => {        
        await ApiClient.logout();
        dispatch({type: "loggedOut"})
    }

    const renderLoginOrLogoutBtn = () => {
        if ( user.isLogged ) {
            return <Button variant="outlined" onClick={handleLogout}>Logout</Button>
        }
        return <Button variant="outlined" onClick={handleLogin}>Login</Button>
    }

    return (
    <Box className="flex gap-2 items-center">
        <Tooltip title={user.status}>
            <IconButton>
                <PersonIcon />
            </IconButton>
        </Tooltip>
        {user.username && <span>{user.username}</span>}
        {renderLoginOrLogoutBtn()}        
        <span></span>
        <UserLoginModal open={isDialogOpen} onClose={() => setDialogOpen(false)}/>
    </Box>
    )
}
