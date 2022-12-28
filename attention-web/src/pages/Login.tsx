import {useTitle} from "../Root";
import {useProps} from "../App";
import {Logo} from "../utils/images";
import React, {useState} from "react";
import {IconButton, InputAdornment, TextField, Typography} from "@mui/material";
import {Visibility, VisibilityOff} from "@mui/icons-material";


function Login() {

    const {webApp} = useProps()

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [passwordShown, setPasswordShown] = useState(false);

    const handleClickShowPassword = () => {
        setPasswordShown(!passwordShown)
    }

    const usernameChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        const filtered = event.target.value.replaceAll(/[^a-zA-Z@_\-+.]/gm, '')
        setUsername(filtered.substring(0, 150))
    }

    const passwordChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(event.target.value.replaceAll(/\n/gm, ''))
    }

    useTitle(webApp, 'Login')
    // TODO
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <div style={{flexShrink: 0, flexGrow: 1, flexDirection: "column"}} className={"center"}>
                <Logo height={"10vh"} width={"10vh"}/>
                <Typography variant={"h3"}>Login</Typography>
                <div style={{height: "20pt"}} />
                <TextField variant={"outlined"} margin="normal" label={"Username"} value={username} onChange={usernameChanged} className={"textfield-width"}/>
                <TextField variant={"outlined"} margin="normal" label={"Password"} value={password} onChange={passwordChanged} className={"textfield-width"}
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
                {
                    // TODO login button
                    // TODO create account button
                }
            </div>
            <footer className={"center-horizontal"}>
                <a style={{textDecoration: "none", color: "inherit"}}
                   href={"https://aracroproducts.com"}>By Aracro Products</a>
            </footer>
        </div>
    )
}

export default Login
