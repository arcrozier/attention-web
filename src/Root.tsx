import React, {useEffect, useState} from "react";
import {
    Params,
    useLocation,
    useNavigate,
    useOutletContext,
    Outlet
} from "react-router-dom";
import Cookies from "js-cookie";
import {
    Alert,
    createTheme,
    IconButton,
    responsiveFontSizes, Snackbar,
    ThemeProvider,
    Typography,
    useMediaQuery
} from "@mui/material";
import {Close} from "@mui/icons-material";
import {SESSION_ID_COOKIE} from "./utils/defs";
import './css/animations.css'

export interface Properties {
    darkMode: boolean,
    webApp: boolean
}


export interface SnackbarStatus {
    severity: 'error' | 'info' | 'success' | 'warning',
    message: string,
    autoHideDuration: number | null,
}

export function useSnackBarStatus() {
    return useState<SnackbarStatus | null>(null)
}

export function useProps() {
    return useOutletContext<Properties>()
}

export function useBack() {
    const navigate = useNavigate()
    const location = useLocation()
    return (url: string) => {
        if (location.state === null || !location.state.usr || !location.state.usr.goBack) {
            window.history.replaceState({goBack: false}, "", url)
            window.history.pushState({goBack: true}, "", '')
        }
        navigate(-1)
    }
}

export interface match {
    id: string,
    pathname: string,
    params: Params,
    data: unknown,
    handle: unknown
}

export function useChild(id: string, matches: match[]): match | null {
    for (let i = 0; i < matches.length - 1; i++) {
        if (matches[i].id === id) {
            return matches[i + 1]
        }
    }
    return null
}

/**
 * Returns a function that performs a logout
 *
 * redirect: boolean - whether to redirect to the login page after logging out (defaults to true)
 * onCompleteURL: string - the URL to redirect to after the user successfully logs in (defaults
 * to null, which redirects the user to the home page)
 */
export function useLogout(): (redirect?: boolean, onCompleteURL?: string | null) => void {
    const navigate = useNavigate()

    return (redirect: boolean = true, onCompleteURL: string | null = null) => {
        Cookies.remove(SESSION_ID_COOKIE)
        window.localStorage.clear()
        if (redirect) {
            navigate('/login', {replace: true, state: {redirect: onCompleteURL}})
        }
    }
}

export function useAnimations(): boolean {
    return !useMediaQuery('(prefers-reduced-motion: reduce)');
}

/**
 * Returns whether the device supports a native app
 *
 * Currently, only true for Android and ChromeOS
 */
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

export function Root() {
    const isWebApp = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches);

    const darkMode = useMediaQuery('(prefers-color-scheme: dark)');
    useLocation();
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

    const [snackbar, setSnackbar] = useSnackBarStatus()

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
        <Typography variant={"button"} component={"span"}>
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
            <Close/>
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
            <Snackbar open={snackbar !== null} onClose={() => setSnackbar(null)}
                      autoHideDuration={snackbar?.autoHideDuration}>
                <Alert onClose={() => setSnackbar(null)} severity={snackbar?.severity}>
                    {snackbar?.message}
                </Alert>
            </Snackbar>
        </ThemeProvider>
    )
}

/**
 * Sets the title for the page
 *
 * @param webApp - whether it is running as a standalone web app
 * @param page - the name of the page
 */
export function useTitle(webApp: boolean, page: string) {
    useEffect(() => {
        document.title = (webApp ? '' : 'Attention! ') + page
    })
}
