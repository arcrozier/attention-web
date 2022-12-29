import {useTitle} from "../Root";
import {useProps} from "../App";


function Settings() {

    const {webApp} = useProps()

    useTitle(webApp, 'Settings')
    // TODO
    return <p>Settings!</p>
}

export default Settings
