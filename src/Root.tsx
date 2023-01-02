import React, {useEffect, useState} from "react";
import {Outlet, useNavigate, useOutletContext} from "react-router-dom";
import Cookies from "js-cookie";
import {
    createTheme,
    IconButton,
    responsiveFontSizes,
    ThemeProvider,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Close} from "@mui/icons-material";


export interface Properties {
    darkMode: boolean,
    webApp: boolean
}

export function useProps() {
    return useOutletContext<Properties>()
}

export function useBack() {
    const navigate = useNavigate()
    return (url: string) => {
        if (window.history.state === null || !window.history.state.usr || !window.history.state.usr.goBack) {
            window.history.replaceState({goBack: false}, "", url)
            window.history.pushState({goBack: true}, "", '')
        }
        navigate(-1)
    }
}

function supportsApp(): boolean {

    const stringAppSupport = (platform: string, userAgent: string): boolean => {
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
    const isWebApp = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');

    const theme = React.useMemo(
        () =>
            responsiveFontSizes(createTheme({
                palette: {
                    mode: darkMode ? 'dark' : 'light',
                    primary: {
                        main: "#2740fd",
                        light: "#2740fd",
                        dark: "#bbc2ff",
                    },
                    secondary: {
                        main: "#a700b0",
                        light: "#a700b0",
                        dark: "#ffa9fa"
                    }
                },
            })),
        [darkMode],
    );

    const [showPrompt, setShowPrompt] = useState(supportsApp() && Cookies.get("app-prompt") !== "false")

    const props: Properties = {
        darkMode: darkMode,
        webApp: isWebApp
    }

    const primaryColor = darkMode ? theme.palette.primary.dark : theme.palette.primary.light
    const appBtn = <a className={'btn center'} style={{
        width: "100%",
        height: "72pt",
        borderRadius: 0,
        position: "sticky",
        bottom: "0px",
        flexGrow: 0,
        display: "flex",
        flexShrink: 0,
        flexDirection: "row",
        backgroundColor: primaryColor,
        color: theme.palette.getContrastText(primaryColor)
    }} href={'/app/'}>
        <Typography variant={"button"}>
            Download the app!
        </Typography>

        <IconButton aria-label={"close"} style={{
            position: "absolute",
            top: "0px",
            right: "0px",
            color: "inherit"
        }} onClick={(e) => {
            e.preventDefault()
            Cookies.set("app-prompt", "false")
            setShowPrompt(false)
        }
        }>
            <Close />
        </IconButton>
        </a>

    return (
        <ThemeProvider theme={theme}>
            <div style={{
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                backgroundColor: theme.palette.background.default,
                color: theme.palette.getContrastText(theme.palette.background.default)
            }}>
                <Outlet context={props}/>
                {showPrompt && appBtn}
            </div>
        </ThemeProvider>
    )
}


export function useTitle(webApp: boolean, page: string) {
    useEffect(() => {
        document.title = (webApp ? '' : 'Attention! ') + page
    })
}
