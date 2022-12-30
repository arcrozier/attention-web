import {useTitle, useProps} from "../Root";
import {Logo} from "../utils/images";
import React, {useEffect, useState} from "react";
import {
    Button, Checkbox,
    Divider, FormControlLabel,
    IconButton,
    InputAdornment,
    TextField,
    Typography
} from "@mui/material";
import {Check, Close, Visibility, VisibilityOff} from "@mui/icons-material";
import {Outlet, redirect, useNavigate} from "react-router-dom";
import {
    couldBeEmail,
    LIST_ELEMENT_PADDING,
    stripNewlines,
    TextFieldStatus,
    usernameChanged
} from "../utils/defs";
import {LoadingButton} from "@mui/lab";
import {Link} from "react-router-dom";
import {createAccount, login} from "../utils/repository";

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

    const navigate = useNavigate()

    useGoogleSignIn()

    const handleClickShowPassword = () => {
        setPasswordShown(!passwordShown)
    }

    const doLogin = () => {
        const loginPromise = login(username, password)
        setLoading(true)

        loginPromise.then(() => {
            navigate('/', {replace: true})
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
                 data-callback={doGoogleSignIn}
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
                setPassword(stripNewlines(e))
            }} helperText={passwordStatus.message} className={"textfield-width"}
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

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [tosAgree, setTosAgree] = useState(false)
    const [tosAgreeError, setTosAgreeError] = useState(false)
    const [usernameStatus, setUsernameStatus] = useState<TextFieldStatus>({
        error: false,
        message: ''
    })
    const [passwordStatus, setPasswordStatus] = useState<TextFieldStatus>({
        error: false,
        message: ''
    })
    const [confirmPasswordStatus, setConfirmPasswordStatus] = useState<TextFieldStatus>({
        error: false,
        message: ''
    })
    const [emailStatus, setEmailStatus] = useState<TextFieldStatus>({error: false, message: ''})
    const [passwordShown, setPasswordShown] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleClickShowPassword = () => {
        setPasswordShown(!passwordShown)
    }

    const navigate = useNavigate()

    const doCreateAccount = () => {
        try {
            setLoading(true)
            let valid = true
            if (password.length < 8) {
                valid = false
                setPasswordStatus({error: true, message: 'Password must be at least 8 characters'})
            }
            if (password !== confirmPassword) {
                valid = false
                setConfirmPasswordStatus({error: true, message: 'Passwords must match'})
            }
            if (email.length !== 0 && !couldBeEmail(email)) {
                valid = false
                setEmailStatus({error: true, message: 'Enter valid email or leave blank'})
            }
            if (!tosAgree) {
                valid = false
                setTosAgreeError(true)
            }
            if (!valid) return;

            createAccount(username, email, firstName, lastName, password, tosAgree).then(() => {
                login(username, password).then(() => {
                    navigate('/', {replace: true})
                    }
                )
                }).catch((error) => {
                if (error.response && error.response.status === 400) {
                    console.log(error)
                    setPasswordStatus({error: true, message: 'Invalid username or password'})
                } else {
                    throw(error)
                }
            })
        } finally {
            setLoading(false)
        }
    }

    useTitle(webApp, 'Create Account')

    return (
        <div>
            <Typography variant={"h3"}>Login</Typography>
            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} error={usernameStatus.error} label={"Username"}
                       value={username} onChange={(e) => {
                setUsername(usernameChanged(e))
                setUsernameStatus({error: false, message: ''})
            }} required={true} className={"textfield-width"} helperText={usernameStatus.message}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} error={emailStatus.error} label={"Email"} value={email}
                       onChange={(e) => {
                           setEmail(stripNewlines(e))
                           setEmailStatus({error: false, message: ''})
                       }} className={"textfield-width"} required={false} helperText={emailStatus.message}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} label={"First name"} value={firstName}
                       onChange={(e) => {
                           setFirstName(stripNewlines(e))
                       }} className={"textfield-width"} required={false}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} label={"Last name"} value={lastName} onChange={(e) => {
                setLastName(stripNewlines(e))
            }} className={"textfield-width"} required={false}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} label={"Password"} error={passwordStatus.error}
                       value={password} onChange={(e) => {
                setPassword(stripNewlines(e))
                setPasswordStatus({error: false, message: ''})
            }} className={"textfield-width"} required={true}
                       type={passwordShown ? "text" : "password"} name={"password"}
                       InputProps={{
                           endAdornment: <InputAdornment position="end">
                               <IconButton
                                   onClick={handleClickShowPassword}
                               >
                                   {passwordShown ? <Visibility/> : <VisibilityOff/>}
                               </IconButton>
                           </InputAdornment>
                       }} helperText={passwordStatus.message}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <TextField variant={"outlined"} label={"Confirm password"}
                       error={confirmPasswordStatus.error}
                       required={true}
                       helperText={confirmPasswordStatus.message} value={confirmPassword} type={passwordShown ? "text" : "password"}
                       onChange={(e) => {
                           setConfirmPassword(stripNewlines(e))
                           setConfirmPasswordStatus({error: false, message: ''})
                       }} InputProps={{
                endAdornment: <InputAdornment position="end">
                    {confirmPassword.length === 0 ? null : (confirmPassword === password ?
                        <Check color={"success"}/> : <Close color={"error"}/>)}
                </InputAdornment>
            }} onKeyPress={(event) => {
                if (event.key === 'Enter') {
                    doCreateAccount()
                }
            }}/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <FormControlLabel control={<Checkbox checked={tosAgree} onChange={() => {
                setTosAgree(!tosAgree)
                setTosAgreeError(false)
            }} required={true} color={tosAgreeError ? "error" : "primary"}/>}
            label={
                <p>
                    I have read and agree to the <a href={"https://aracroproducts.com/legal/tos/"}>Terms of Service</a>
                </p>
            }/>

            <div style={{height: LIST_ELEMENT_PADDING}}/>
            <LoadingButton variant={"contained"} loading={loading} onClick={doCreateAccount}>Create
                account</LoadingButton>
        </div>
    )
}
