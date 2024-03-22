import TextField from "@mui/material/TextField";
import { User, UserCreate, UserCredentials } from "../../types/user";
import { useForm, SubmitHandler } from "react-hook-form"
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useApiClient } from "../../hooks/useApiClient";

export type UserLoginFormProps = {
    /**
     * Triggered when user is logged, user is defined if operation succeed, or null if failed.
     * signedUp flag is present only when user just signed-up (or tried to).
    */
    onLogged: (event: { user: User | null, signedUp?: true} ) => void;
}

/**
 * Provides a simple login form with username and password input fields.
 */
export function UserLoginForm({ onLogged: dispatchEvent }: UserLoginFormProps) {

    const api = useApiClient();
    const [signUp, setSignUp] = useState(false);
    const [status, setStatus] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserCredentials & UserCreate>()

    const onSubmitLogin: SubmitHandler<UserCredentials> = async (formData, event) => {
        event?.preventDefault();
        setStatus('Connecting...')
        const user = await api.login(formData);    
        setStatus(user ? "Success" : "Unable to login, check your credentials an retry.");
        dispatchEvent({user})
    }

    const onSubmitSignUp: SubmitHandler<UserCreate> = async (formData, event) => {
        event?.preventDefault();
        setStatus('Signing-Up...')
        const user = await api.signup(formData);    
        setStatus(user ? "Success" : "Unable to sign-up, login may be already in use.");
        dispatchEvent({user, signedUp: true});
    }

    return (
        <form
            onSubmit={handleSubmit( signUp ? onSubmitSignUp : onSubmitLogin)}
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
            {status && <span className="italic">{status}</span>}
            <Box className="flex gap-2 justify-center">
                <Button type="reset" variant="contained">Reset</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
        </form>
    )
}
