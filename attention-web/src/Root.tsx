import {useEffect, useState} from "react";
import {useOutletContext, Outlet} from "react-router-dom";
import Cookies from "js-cookie";
import {Close} from "./Close";


export interface Properties {
    darkMode: boolean,
    webApp: boolean
}

export function useProps() {
    return useOutletContext<Properties>()
}

function supportsApp(): boolean {

    const stringAppSupport = (platform: string, userAgent: string): boolean => {
        console.log(`Platform: ${platform} \n userAgent: ${userAgent}`)
        return (
                platform.toLowerCase().includes('linux') && userAgent.toLowerCase().includes('cros')
            ) || platform.toLowerCase().includes('android') ||
            platform.toLowerCase().includes('chrome os')
    }


    // @ts-ignore
    if (window.navigator["userAgentData"] && window.navigator.userAgentData["platform"]) {
        // @ts-ignore
        return stringAppSupport(window.navigator.userAgentData.platform, window.navigator.userAgent)
    } else if (window.navigator["platform"]) {
        return stringAppSupport(window.navigator.platform, window.navigator.userAgent)
    }
    return false
}

export default function Root() {
    const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const isWebApp = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        setDarkMode(e.matches)
    });

    const [showPrompt, setShowPrompt] = useState(supportsApp() && Cookies.get("app-prompt") !== "false")

    const props: Properties = {
        darkMode: darkMode,
        webApp: isWebApp
    }

    const appBtn = <a className={'btn btn-primary'} style={{
        width: "100%",
        height: "72pt",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 0,
        position: "sticky",
        bottom: "0px",
        flexGrow: 0,
        flexShrink: 0
    }} href={'/app/'}>
        <div style={{
            position: "absolute",
            top: "0px",
            right: "0px",
        }} onClick={ (e) => {
            e.preventDefault()
            Cookies.set("app-prompt", "false")
            setShowPrompt(false)
        }
        }>
            <Close fill={"#FFFFFF"} height={"24px"} width={"24px"} />
        </div>
        Download the app!</a>

    return (
        <div style={{height: "100%", display: "flex", flexDirection: "column"}}>
            <Outlet context={props}/>
            {showPrompt && appBtn}
        </div>
    )
}


export function useTitle(webApp: boolean, page: string) {
    useEffect(() => {
        document.title = (webApp ? '' : 'Attention! ') + page
    })
}
