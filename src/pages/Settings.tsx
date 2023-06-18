import {useTitle} from "../Root";
import {useProps} from "../App";

interface PreferenceGroupProps {
    title: string,
    children: React.ReactNode
}

interface PreferenceProps<T> {
    icon?: React.ReactNode,
    title: string,
    value: T,
    action?: React.ReactNode,
    summary?: (value: T) => string,
    onClick?: () => void,
    enabled?: boolean,
    titleColor?: string,
    summaryColor?: string,
    disabledTitleColor?: string,
    disabledSummaryColor?: string
}

interface DialogPreferenceProps<T> extends PreferenceProps<T> {
    dialog: React.ReactNode,
}

function Preference<T>(props: PreferenceProps<T>) {

}

function DialogPreference<T>(props: DialogPreferenceProps<T>) {

}

function PreferenceGroup(props: {title: string, children: React.ReactNode}) {

}

function SplitPreference(props: {small: React.ReactNode, large: React.ReactNode}) {

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
