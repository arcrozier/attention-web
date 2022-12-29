import {useTitle} from "../Root";
import {useProps} from "../App";
import {Logo} from "../utils/images";
import React, {useState} from "react";
import {Button, Divider, IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {Google, Outlet, Visibility, VisibilityOff} from "@mui/icons-material";
import {
    LIST_ELEMENT_PADDING,
    passwordChanged,
    TextFieldStatus,
    usernameChanged
} from "../utils/defs";
import {LoadingButton} from "@mui/lab";
import {Link} from "react-router-dom";
import {login} from "../utils/repository";

export function AuthRoot() {
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <div style={{flexShrink: 0, flexGrow: 1, flexDirection: "column"}} className={"center"}>
                <Logo height={"10vh"} width={"10vh"}/>
                <Outlet />
            </div>
            <footer className={"center-horizontal"}>
                <a style={{textDecoration: "none", color: "inherit"}}
                   href={"https://aracroproducts.com"}>By Aracro Products</a>
            </footer>
        </div>
    )
}


function Login() {

    const {webApp} = useProps()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false);
    const [loading, setLoading] = useState(false)
    const [passwordStatus, setPasswordStatus] = useState<TextFieldStatus>({error: false, message: ''})

    const handleClickShowPassword = () => {
        setPasswordShown(!passwordShown)
    }

    useTitle(webApp, 'Login')
    // TODO
    return (
        <div>
                <Typography variant={"h3"}>Login</Typography>
                <div style={{height: LIST_ELEMENT_PADDING}} />
                <TextField variant={"outlined"} label={"Username"} value={username} onChange={(e) => {
                    setUsername(usernameChanged(e))
                }} className={"textfield-width"}/>
                <div style={{height: LIST_ELEMENT_PADDING}} />
                <TextField variant={"outlined"} label={"Password"} value={password} onChange={(e) => {
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
                           }}/>

                <div style={{height: LIST_ELEMENT_PADDING}} />
                <LoadingButton variant={"contained"} loading={loading} onClick={() => {
                    const loginPromise = login(username, password)
                    setLoading(true)

                    loginPromise.then(() => {
                        window.location.replace('/')
                    }).catch((error) => {
                        if (error.response && error.response.status % 100 == 4) {

                        }
                    }).finally(() => {
                        setLoading(false)
                    })
                }}>Log in</LoadingButton>

                <div style={{height: LIST_ELEMENT_PADDING}} />
                <Divider className={"textfield-width"} />

                <div style={{height: LIST_ELEMENT_PADDING}} />
                <Button startIcon={<Google />} variant={"outlined"} onClick={() => {
                    // TODO Google OAuth
                }}>
                    Sign in with Google
                </Button>

                <div style={{height: LIST_ELEMENT_PADDING}} />
                <Button component={Link} to={'/create-account/'} >
                    Create account
                </Button>
            </div>
    )
}

export default Login
