import {useTitle} from "../Root";
import {useProps} from "../App";


function Login() {

    const {webApp} = useProps()

    useTitle(webApp, 'Login')
    // TODO
    return <p>Login!</p>
}

export default Login
