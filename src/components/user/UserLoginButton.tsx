import { Box, Button, IconButton, Tooltip } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import { useUserContext } from "../../contexts/UserContext";
import { MouseEventHandler, useState } from "react";
import { UserLoginModal } from "./UserLoginModal";
import { useApiClient } from "../../hooks/useApiClient";

export function UserLoginButton() {
    const [isDialogOpen, setDialogOpen] = useState(false);
    const context = useUserContext();
    const api = useApiClient();
    
    const handleLogin: MouseEventHandler = async (event) => {  
        event.preventDefault();      
        setDialogOpen(true);
    }

    const handleLogout: MouseEventHandler = async (event) => {        
        event.preventDefault();
        api.logout(); // user context will be updated
    }

    const renderLoginOrLogoutBtn = () => {
        if ( context.isLogged ) {
            return <Button variant="outlined" onClick={handleLogout}>Logout</Button>
        }
        return <Button variant="outlined" onClick={handleLogin}>Login</Button>
    }

    return (
    <Box className="flex gap-2 items-center">
        <Tooltip title={context.status}>
            <IconButton>
                <PersonIcon />
            </IconButton>
        </Tooltip>
        {context.username && <span>{context.username}</span>}
        {renderLoginOrLogoutBtn()}        
        <span></span>
        <UserLoginModal open={isDialogOpen} onClose={() => setDialogOpen(false)}/>
    </Box>
    )
}
