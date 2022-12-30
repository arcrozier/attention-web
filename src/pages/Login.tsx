import {useTitle, useProps} from "../Root";
import {Logo} from "../utils/images";
import React, {useEffect, useState} from "react";
import {Button, Divider, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {Google, Visibility, VisibilityOff} from "@mui/icons-material";
import {Outlet} from "react-router-dom";
import {
    LIST_ELEMENT_PADDING,
    passwordChanged,
    TextFieldStatus,
    usernameChanged
} from "../utils/defs";
import {LoadingButton} from "@mui/lab";
import {Link} from "react-router-dom";
import {login} from "../utils/repository";

const useGoogleSignIn = () => {
    useEffect(() => {
        const script = document.createElement('script');

        script.src = "https://accounts.google.com/gsi/client";
        script.async = true;
        script.defer = true;

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, []);
}

export function AuthRoot() {
    const props = useProps()

    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <div style={{flexShrink: 0, flexGrow: 1, flexDirection: "column"}} className={"center"}>
                <Logo height={"10vh"} width={"10vh"}/>
                <Outlet context={props}/>
            </div>
            <footer className={"center-horizontal"}>
                <a style={{textDecoration: "none", color: "inherit"}}
                   href={"https://aracroproducts.com"}>By Aracro Products</a>
            </footer>
        </div>
    )
}


export function Login() {

    const {webApp, darkMode} = useProps()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false);
    const [loading, setLoading] = useState(false)
    const [passwordStatus, setPasswordStatus] = useState<TextFieldStatus>({
        error: false,
        message: ''
    })

    useGoogleSignIn()

    const handleClickShowPassword = () => {
        setPasswordShown(!passwordShown)
    }

    const doLogin = () => {
        const loginPromise = login(username, password)
        setLoading(true)

        loginPromise.then(() => {
            window.location.replace('/')
        }).catch((error) => {
            if (error.response && error.response.status === 403) {
                setPasswordStatus({error: true, message: 'Invalid username or password'})
            } else {
                throw(error)
            }
        }).finally(() => {
            setLoading(false)
        })
    }

    const doGoogleSignIn = (result: any) => {
        console.log(`Signing in with Google! ${result}`)
    }

    useTitle(webApp, 'Login')
    // TODO
    return (
        <div>
            <div id="g_id_onload"
                 data-client_id="357995852275-tcfjuvtbrk3c57t5gsuc9a9jdfdn137s.apps.googleusercontent.com"
                 data-context="signin"
                 data-ux_mode="popup"
                 data-callback="doGoogleSignIn"
                 data-nonce=""
                 data-auto_select="true"
                 data-itp_support="true">
            </div>

            <Typography variant={"h3"}>Login</Typography>
            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} error={passwordStatus.error} label={"Username"}
                       value={username} onChange={(e) => {
                setUsername(usernameChanged(e))
            }} className={"textfield-width"}/>
            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} label={"Password"} error={passwordStatus.error}
                       value={password} onChange={(e) => {
                setPassword(passwordChanged(e))
            }} className={"textfield-width"}
                       type={passwordShown ? "text" : "password"} name={"password"}
                       InputProps={{
                           endAdornment: <InputAdornment position="end">
                               <IconButton
                                   onClick={handleClickShowPassword}
                               >
                                   {passwordShown ? <Visibility/> : <VisibilityOff/>}
                               </IconButton>
                           </InputAdornment>
                       }} onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    doLogin()
                }
            }}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <LoadingButton variant={"contained"} loading={loading} onClick={doLogin}>Log
                in</LoadingButton>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <Divider className={"textfield-width"}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <Button startIcon={<Google/>} variant={"outlined"} onClick={() => {
                // TODO Google OAuth
            }}>
                Sign in with Google
            </Button>

            <div className="g_id_signin"
                 data-type="standard"
                 data-shape="rectangular"
                 data-theme={darkMode ? "filled_black" : "outline"}
                 data-text="signin_with"
                 data-size="large"
                 data-locale="en"
                 data-logo_alignment="left">
            </div>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <Button component={Link} to={'/create-account/'}>
                Create account
            </Button>
        </div>
    )
}

export function CreateAccount() {

    const {webApp} = useProps()

    useTitle(webApp, 'Create Account')

    return (
        <div>
            {
                // TODO
            }
        </div>
    )
}
