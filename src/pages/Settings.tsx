import {useTitle} from "../Root";
import {useProps} from "../App";


export function Settings() {

    const {webApp} = useProps()

    useTitle(webApp, 'Settings')
    // TODO
    return (
        <div>
            <p>Settings!</p>
        </div>
        )
}

export default Settings
