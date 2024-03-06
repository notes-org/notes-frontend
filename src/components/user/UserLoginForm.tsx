import TextField from "@mui/material/TextField";
import { UserCreate, UserCredentials } from "../../types/user";
import { useForm, SubmitHandler } from "react-hook-form"
import { ApiClient } from "../../utils/ApiClient";
import { useUserDispatch } from "../../contexts/UserContext";
import { Box, Button } from "@mui/material";
import { useState } from "react";

type Props = {
    onLogged: () => void;
}

/**
 * Provides a simple login form with username and password input fields.
 */
export function UserLoginForm({ onLogged }: Props) {

    const dispatch = useUserDispatch();
    const [signUp, setSignUp] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserCredentials | UserCreate>()

    const onSubmit: SubmitHandler<UserCredentials | UserCreate> = async (data, event) => {

        event?.preventDefault();

        if( signUp && 'email' in data) {
            const connected = await ApiClient.signup(data);
            if ( connected ) {
                dispatch({ type: 'loggedIn', username: data.username})
                onLogged()
            } else {
                dispatch({ type: 'error', message: "unable to log in"})
            }
        } else {
            const connected = await ApiClient.login(data);
            if ( connected ) {
                dispatch({ type: 'loggedIn', username: data.username})
                onLogged()
            } else {
                dispatch({ type: 'error', message: "unable to log in"})
            }            
        }
        event?.target.reset();
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-2 gap-3"
        >
            <h1 className="text-2xl">
                { signUp ? 'Sign-Up Form' : 'Login Form'}
            </h1>
            <TextField {...register("username")} required label="Username" variant="standard" />
            {errors.username && <span>This field is required</span>}

            <TextField {...register("password")} required label="Password" variant="standard" type="password"/>
            {errors.password && <span>This field is required</span>}

            { signUp && <>
            <TextField {...register("email")} required label="Email" variant="standard" type="email"/>
            {'email' in errors && <span>This field is required</span>}
            </>}
            <a
                className="my-3 text-xs italic cursor-pointer hover:underline text-gray-400"
                onClick={() => setSignUp(v => !v)}
            >
                { signUp ? 'Already have an account? Sign-in' : 'No account yet? Sign-up' }
            </a>
            <Box className="flex gap-2 justify-center">
                <Button type="reset" variant="contained">Reset</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
        </form>
    )
}
