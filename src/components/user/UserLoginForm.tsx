import TextField from "@mui/material/TextField";
import { UserCredentials } from "../../types/user";
import { useForm, SubmitHandler } from "react-hook-form"
import { ApiClient } from "../../utils/ApiClient";
import { useUserDispatch } from "../../contexts/UserContext";
import { Box, Button } from "@mui/material";

type Props = {
    onLogged: () => void;
}

/**
 * Provides a simple login form with username and password input fields.
 */
export function UserLoginForm({ onLogged }: Props) {

    const dispatch = useUserDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserCredentials>()

    const onSubmit: SubmitHandler<UserCredentials> = async (credentials, event) => {

        event?.preventDefault();

        // TODO: consider grouping these 3 dispatch calls into ApiClient after turning ApiClient into a hook.
        //       An other option would be to use Redux with 3rd party.

        dispatch({ type: 'logging'})
        const connected = await ApiClient.login(credentials);
        if ( connected ) {
            dispatch({ type: 'loggedIn', username: credentials.username})
            onLogged()
        } else {
            dispatch({ type: 'error', message: "unable to log in"})
        }
        event?.target.reset();
    }

    return (
        <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col p-2 gap-3"
        >
            <h1>Login Form</h1>
            <TextField {...register("username")} required label="Username" variant="standard" />
            {errors.username && <span>This field is required</span>}

            <TextField {...register("password")} required label="Password" variant="standard" type="password"/>
            {errors.password && <span>This field is required</span>}

            <Box className="flex gap-2 justify-center">
                <Button type="reset" variant="contained">Reset</Button>
                <Button type="submit" variant="contained">Submit</Button>
            </Box>
        </form>
    )
}
