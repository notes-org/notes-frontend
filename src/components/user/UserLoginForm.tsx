import TextField from "@mui/material/TextField";
import { UserCredentials } from "../../types/user";
import { useForm, SubmitHandler } from "react-hook-form"
import { ApiClient } from "../../utils/ApiClient";
import { useUserDispatch } from "../../contexts/UserContext";


/**
 * Provides a simple login form with username and password input fields.
 */
export function UserLoginForm() {

    const dispatch = useUserDispatch();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserCredentials>()

    const onSubmit: SubmitHandler<UserCredentials> = async (credentials) => {
        console.log(credentials);

        // TODO: consider grouping these 3 dispatch calls into ApiClient after turning ApiClient into a hook.
        //       An other option would be to use Redux with 3rd party.

        dispatch({ type: 'logging'})
        const connected = await ApiClient.login(credentials);
        if ( connected ) {
            dispatch({ type: 'loggedIn', username: credentials.username})
        } else {
            dispatch({ type: 'error', message: "unable to log in"})
        }
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            
            <TextField {...register("username")} required label="Username" variant="standard" />
            {errors.username && <span>This field is required</span>}

            <TextField {...register("password")} required label="Password" variant="standard" type="password"/>
            {errors.password && <span>This field is required</span>}

            <input type="submit" />
        </form>
    )
}
