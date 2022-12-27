import {useTitle} from "../Root";
import {useProps} from "../App";


function Login() {

    const {webApp} = useProps()

    useTitle(webApp, 'Login')
    // TODO
    return (
        <div style={{display: "flex", flexDirection: "column", height: "100%"}}>
            <div style={{flexShrink: 0, flexGrow: 1}}>
                Login!
            </div>
            <footer className={"center"}>
                <a style={{textDecoration: "none", color: "inherit"}} href={"https://aracroproducts.com"}>By Aracro Products</a>
            </footer>
        </div>
    )
}

export default Login
