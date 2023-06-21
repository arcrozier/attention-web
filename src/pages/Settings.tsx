import {useTitle} from "../Root";
import {useProps} from "../App";
import {LIST_ELEMENT_PADDING, SINGLE_LINE} from "../utils/defs";
import {Typography, useTheme} from "@mui/material";
import Color from "color"
import React, {useMemo, useRef, useState} from "react";
import {Await} from "react-router-dom";
import '../animations.css'

const ICON_SIZE = "40px"
const PREFERENCE_HEIGHT = "72px"

interface PreferenceProps<T> {
    icon?: React.ReactNode,
    title: string,
    value: T,
    action?: React.ReactNode,
    summary?: ((value: T) => string) | null,
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
    const summary = props.summary === null ? null : props.summary !== undefined ? props.summary(props.value) : "" + props.value;

    const titleColor = useMemo(() => {
        return props.titleColor ? props.titleColor : Color(theme.palette.getContrastText(theme.palette.background.default)).hexa()
    }, [props.titleColor, theme.palette])
    const summaryColor = useMemo(() => {
        return props.summaryColor ? props.summaryColor : Color(theme.palette.getContrastText(theme.palette.background.default)).fade(0.25).hexa()
    }, [props.summaryColor, theme.palette])


    return (
        <div style={{width: "100%", height: PREFERENCE_HEIGHT, display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "start", cursor: "pointer"}} onClick={props.onClick}>
            <div style={{height: ICON_SIZE, width: ICON_SIZE, overflow: "hidden", flexGrow: 0, flexShrink: 0, marginRight: LIST_ELEMENT_PADDING}}>
                {props.icon}
            </div>
            <div style={{flexGrow: 1, display: "flex", flexDirection: "column", justifyContent: "center", overflow: "hidden"}}>
                <Typography variant={"subtitle1"} style={{color: titleColor, ...SINGLE_LINE}}>{props.title}</Typography>
                {Boolean(summary) && <Typography variant={"body2"} style={{color: summaryColor, ...SINGLE_LINE}}>{summary}</Typography>}
            </div>
            {props.action}
        </div>
    )
}

function DialogPreference<T>(props: DialogPreferenceProps<T>) {

}

function PreferenceGroup(props: {title: string, children: React.ReactNode, first?: boolean}) {
    const theme = useTheme()
    return (<div style={{width: "100%", borderTop: `${props.first ? 'none' : 'solid'} thin ${theme.palette.divider}`}}>
        <Typography variant={"h4"}>{props.title}</Typography>
        {props.children}
    </div>)
}

function SplitPreference(props: {small: React.ReactNode, large: React.ReactNode}) {
    const theme = useTheme()
    return (<div style={{width: "100%", height: PREFERENCE_HEIGHT, display: "flex", flexDirection: "row", alignItems: "center"}}>
        <div style={{flexGrow: 1, height: "100%"}}>
            {props.large}
        </div>
        <div style={{flexGrow: 0, width: "1px", height: "75%", backgroundColor: theme.palette.divider}}/>
        <div style={{flexGrow: 0, height: "100%", width: PREFERENCE_HEIGHT}}>
            {props.small}
        </div>
    </div>)
}

// How to handle large screens:
//  ugly (just a wide version of the normal screen)
//      slight improvement: on wide screens, center text like login screen
export function Settings() {

    const {webApp, darkMode, userInfo} = useProps()
    const theme = useTheme()

    useTitle(webApp, 'Settings')
    // TODO

    const ref = useRef<HTMLDivElement | null>(null)

    const start = useMemo(() => Date.now(), [])
    const [finished, setFinished] = useState(false)

    userInfo?.then(() => {
        setTimeout(() => {
            setFinished(true)
            if (ref.current !== null) {
                ref.current.className = 'opacity1'
            }
        }, 10)
    })

    return (
        <React.Suspense fallback={null}>
            <Await resolve={userInfo} errorElement={<div style={{
                margin: 0,
                display: "flex",
                height: "100%",
                width: "100%",
                alignItems: "center",
                justifyContent: "center"
            }}>
                <p>An error occurred</p>
            </div>}>
                <div ref={ref} className={Date.now() - start > 100 && !finished ? 'opacity0' : 'opacity1'} style={{
                    width: "500pt",
                    maxWidth: "95%", transition: "opacity 1s", borderRadius: "10px", borderWidth: "thin", margin: "auto", borderStyle: "solid", marginTop: "5vh", marginBottom: "5vh", padding: "10px"}}>
                    <PreferenceGroup title={"Account"} first={true}>
                        <Preference onClick={() => {
                            console.log("preference clicked")
                        }} icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 1"} value={1} summary={(v) => {if (v === 1) return "one"; else return "idk " + v}} />
                        <Preference title={"Pref 2"} value={2} />
                        <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 3"} value={3} summary={(v) => {return "value ".repeat(v).repeat(v).repeat(v)}} />
                        <Preference title={"Pref 2"} value={2} titleColor={darkMode ? theme.palette.error.dark : theme.palette.error.light} />
                    </PreferenceGroup>
                    <PreferenceGroup title={"Notifications"} first={false}>
                        <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 1"} value={1} summary={(v) => {if (v === 1) return "one"; else return "idk " + v}} />
                        <Preference title={"Pref 2"} value={2} />
                        <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 3"} value={3} summary={(v) => {return "value ".repeat(v).repeat(v).repeat(v)}} />
                        <Preference title={"Pref 2"} value={2} titleColor={darkMode ? theme.palette.error.dark : theme.palette.error.light} />
                    </PreferenceGroup>
                    <PreferenceGroup title={"Legal"}>
                        <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 1"} value={1} summary={(v) => {if (v === 1) return "one"; else return "idk " + v}} />
                        <Preference title={"Pref 2"} value={2} />
                        <Preference icon={<div style={{height: "100%", width: "100%", backgroundColor: "red"}}/>} title={"Pref 3"} value={3} summary={(v) => {return "value ".repeat(v).repeat(v).repeat(v)}} />
                        <Preference title={"Pref 2"} value={2} titleColor={darkMode ? theme.palette.error.dark : theme.palette.error.light} summary={null} />
                    </PreferenceGroup>
                </div>
            </Await>
        </React.Suspense>

        )
}

export default Settings
