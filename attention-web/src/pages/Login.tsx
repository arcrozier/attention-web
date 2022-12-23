import {Properties, useTitle, useProps} from "../App";
import {useEffect} from "react";


function Login() {

    const {darkMode, webApp} = useProps()
    useTitle(webApp, 'Login')
    // TODO
    return <p>Login!</p>
}

export default Login
