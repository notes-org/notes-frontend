import { Button, Icon } from "@mui/material";
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

    return (<>
        <Icon>user</Icon>
        {user.username && <span>{user.username}</span>}
        <Button onClick={
            user.isLogged ? handleLogout
                          : handleLogin
            }>{user.isLogged ? 'Logout'
                             : 'Login'}
        </Button>
        <span>{user.status}</span>
        <UserLoginModal open={isDialogOpen} onClose={() => setDialogOpen(false)}/>
    </>)
}
