import {useTitle} from "../Root";
import {useProps} from "../App";
import {LIST_ELEMENT_PADDING, SINGLE_LINE} from "../utils/defs";
import {Typography, useTheme} from "@mui/material";
import Color from "color"
import {useMemo} from "react";

const ICON_SIZE = "40px"
const PREFERENCE_HEIGHT = "72px"

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
    const theme = useTheme()
    const summary = props.summary ? props.summary(props.value) : "" + props.value;

    const titleColor = useMemo(() => {
        return props.titleColor ? props.titleColor : Color(theme.palette.getContrastText(theme.palette.background.default)).hexa()
    }, [props.titleColor])
    const summaryColor = useMemo(() => {
        return props.summaryColor ? props.summaryColor : Color(theme.palette.getContrastText(theme.palette.background.default)).fade(0.25).hexa()
    }, [props.summaryColor])


    return (
        <div style={{width: "100%", height: PREFERENCE_HEIGHT, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start"}} onClick={props.onClick}>
            <div style={{height: ICON_SIZE, width: ICON_SIZE, overflow: "hidden", flexGrow: 0, flexShrink: 0, margin: LIST_ELEMENT_PADDING}}>
                {props.icon}
            </div>
            <div style={{flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden"}}>
                <Typography variant={"subtitle1"} style={{color: titleColor, ...SINGLE_LINE}}>{props.title}</Typography>
                <Typography variant={"body2"} style={{color: summaryColor, ...SINGLE_LINE}}>{summary}</Typography>
            </div>
            {props.action}
        </div>
    )
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

    const {webApp, darkMode} = useProps()
    const theme = useTheme()

    useTitle(webApp, 'Settings')
    // TODO
    return (
        <div style={{
            width: "500pt",
            maxWidth: "95%", borderRadius: "10px", borderWidth: "thin", margin: "auto", borderStyle: "solid", marginTop: "5vh", paddingRight: "5px"}}>
            <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 1"} value={1} summary={(v) => {if (v === 1) return "one"; else return "idk " + v}} />
            <Preference title={"Pref 2"} value={2} />
            <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 3"} value={3} summary={(v) => {return "value ".repeat(v).repeat(v).repeat(v)}} />
            <Preference title={"Pref 2"} value={2} titleColor={darkMode ? theme.palette.error.dark : theme.palette.error.light} />
        </div>
        )
}

export default Settings
