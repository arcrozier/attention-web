import {Link, useNavigate, useRouteError} from "react-router-dom";
import {AxiosError} from "axios";
import React, {useEffect} from "react";
import {Button, createTheme, responsiveFontSizes, useMediaQuery} from "@mui/material";

export default function ErrorPage() {
    const error = useRouteError() as any;
    const navigate = useNavigate()

    useEffect(() => {
        if (error instanceof AxiosError) {
            if (error.response?.status === 403) {
                navigate('/login', {replace: true})
            }
        }
    }, [error, navigate])


    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            responsiveFontSizes(createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: {
                        main: "#2740fd",
                        light: "#2740fd",
                        dark: "#bbc2ff",
                    },
                    secondary: {
                        main: "#a700b0",
                        light: "#a700b0",
                        dark: "#ffa9fa"
                    }
                },
            })),
        [darkMode],
    );


    if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
            return (<div id={"error-page"}>
                <p>Taking you to the <Link to={"/login"}>login page</Link>...</p>
            </div>)
        }
    }

    return (
        <div id="error-page" style={{
            backgroundColor: theme.palette.background.default,
            color: theme.palette.getContrastText(theme.palette.background.default),
            height: "100vh",
            width: "100%",
            display: "inline-block",
            boxSizing: "border-box"
        }}>
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <Button component={Link} to={'/'} variant={"contained"}>Go Home</Button>
        </div>
    );
}
