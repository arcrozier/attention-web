import {useTitle} from "../Root";
import {useProps} from "../App";
import {ReactElement} from "react";

interface SettingProps {
    icon?: ReactElement,
    title: string
}

function Setting(props: SettingProps) {

}

// How to handle large screens:
//  ugly (just a wide version of the normal screen)
//      slight improvement: on wide screens, center text like login screen
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
