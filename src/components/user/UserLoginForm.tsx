import TextField from "@mui/material/TextField";
import { UserCreate, UserCredentials } from "../../types/user";
import { useForm, SubmitHandler } from "react-hook-form"
import { Box, Button } from "@mui/material";
import { useState } from "react";
import { useApiClient } from "../../hooks/useApiClient";

type Props = {
    onLogged: () => void;
}

/**
 * Provides a simple login form with username and password input fields.
 */
export function UserLoginForm({ onLogged }: Props) {

    const api = useApiClient();
    const [signUp, setSignUp] = useState(false);
    const [status, setStatus] = useState("");
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserCredentials & UserCreate>()

    const onPreSubmit = () => {
        setStatus('Submitting...')
    }

    const onPostSubmit = (success: boolean) => {
        setStatus(success ? "Success" : "Oups, something wrong happened...");
        if ( success ) {
            onLogged();
        }
        event?.target.reset();
    }

    const onSubmitLogin: SubmitHandler<UserCredentials> = async (formData, event) => {
        event?.preventDefault();
        onPreSubmit();
        const success = await api.login(formData);    
        onPostSubmit(success);
    }

    const onSubmitSignUp: SubmitHandler<UserCreate> = async (formData, event) => {
        event?.preventDefault();
        onPreSubmit();
        const success = await api.signup(formData);    
        onPostSubmit(success);
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
            {status && <span>{status}</span>}
            <Box className="flex gap-2 justify-center">
                <Button type="reset" variant="contained">Reset</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
        </form>
    )
}
