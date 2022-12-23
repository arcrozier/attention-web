import {Properties, useTitle, useProps} from "../App";


function Settings() {

    const {darkMode, webApp} = useProps()
    useTitle(webApp, 'Settings')
    // TODO
    return <p>Settings!</p>
}

export default Settings
