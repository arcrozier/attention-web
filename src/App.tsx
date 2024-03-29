import React, {ReactElement, useEffect, useState} from 'react';
import './css/App.css';
import {
    defer,
    Outlet, redirect,
    useLocation,
    useMatches, useOutletContext, useRouteLoaderData
} from "react-router-dom";
import {APIResult, getUserInfo, registerDevice} from "./utils/repository";
import {Properties, useBack, useLogout, useProps as useRootProps} from "./Root";
import {AxiosError, AxiosResponse} from "axios";
import {initializeApp} from 'firebase/app';
import {getMessaging, getToken} from "firebase/messaging";
import {AttentionAppBar} from "./utils/AttentionAppBar";
import {IconButton, Tooltip} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";
import {APP_ID} from "./index";
import Cookies from "js-cookie";
import {SESSION_ID_COOKIE} from "./utils/defs";

const key = "BD_lSto79pwcXtKhH2BCtvf_KMpm3ut6C1ifTIozgLH054fJigE33tR-fqLHRCm13Oms1BYW9coUpqR3Ca5olxk"

const firebaseConfig = {
    apiKey: "AIzaSyC8UHmnpf_yo2tXMBHk-897lL-VnX8pVTk",
    authDomain: "attention-b923d.firebaseapp.com",
    databaseURL: "https://attention-b923d.firebaseio.com",
    projectId: "attention-b923d",
    storageBucket: "attention-b923d.appspot.com",
    messagingSenderId: "357995852275",
    appId: "1:357995852275:web:9c144fd2517203d05f2286",
    measurementId: "G-HKFYEMRZ9S"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

const getNotificationPermission = (onGranted?: () => void, onDenied?: () => void): boolean => {
    if (!("Notification" in window)) {
        return false
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        if (onGranted) {
            onGranted()
        }
        return true
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                if (onGranted) {
                    onGranted()
                }
            } else {
                if (onDenied) {
                    onDenied()
                }
            }
        });
    } else {
        if (onDenied) {
            onDenied()
        }
    }
    return false
}

getToken(messaging, {vapidKey: key}).then((currentToken) => {
    if (currentToken) {
        registerDevice(currentToken).then(() => {
            console.log("registered device!")
        }).catch((error: AxiosError) => {
            if (error.response && error.response.status === 403) {
                console.log("device already registered")
            } else {
                console.log(error)
            }
        })
    } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        getNotificationPermission(() => {
            getToken(messaging, {vapidKey: key}).then((currentToken) => {
                if (currentToken) {
                    registerDevice(currentToken).then(() => {
                        console.log("registered device!")
                    })
                } else {
                    console.log('Unable to get registration token.');
                }
            }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
            })
        })
    }
}).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
})

const ICON_URL = process.env.PUBLIC_URL + '/icon.svg'

export interface AppProperties extends Properties {
    userInfo: Promise<AxiosResponse<APIResult<UserInfo>>> | null
}

export enum MESSAGE_STATUS {
    SENT = "Sent",
    DELIVERED = "Delivered",
    READ = "Read"
}

export interface Friend {
    friend: string,
    name: string,
    sent: number,
    received: number,
    last_message_id_sent: string | null,
    last_message_status: string | null,
    photo: string | null
}

export interface UserInfo {
    username: string,
    first_name: string,
    last_name: string,
    email: string | null,
    password_login: boolean,
    photo: string,
    friends: Friend[]
}

export async function userInfoLoader({params}: {params: {}}) {
    if ('add' in params && params.add !== 'add') {
        return redirect('/')
    }
    return defer({userInfo: getUserInfo()})
}

export function useProps() {
    return useOutletContext<AppProperties>()
}

export function notify(title: string, options: NotificationOptions | undefined = undefined, onclick: ((this: Notification, ev: Event) => any) | null = null): boolean {
    // set defaults
    options = {...{badge: ICON_URL, icon: ICON_URL, renotify: true}, ...options}
    return getNotificationPermission(() => {
        const notification = new Notification(title, options)
        notification.onclick = onclick
    })
}

export function App() {

    const userInfo = useRouteLoaderData(APP_ID) as { userInfo: Promise<AxiosResponse<APIResult<UserInfo>>> }

    const {darkMode, webApp} = useRootProps()

    const [loading, setLoading] = useState(true)

    const logout = useLogout()

    const location = useLocation()

    if (!Cookies.get(SESSION_ID_COOKIE)) {
        logout(false, `${location.pathname}${location.search}`)
    }

    useEffect(() => {
            userInfo.userInfo?.then(() => {
                setLoading(false)
            }).catch((error: AxiosError) => {
                setLoading(false)
                if (error.response && error.response.status === 403) {
                    console.error("logging out")
                    logout(true, `${location.pathname}${location.search}`)
                } else {
                    throw(error)
                }
            })
        // eslint-disable-next-line
    }, [userInfo])

    const matches = useMatches()

    const back = useBack()

    console.log(matches)

    const appBarParams = (matches.filter((match) => match.handle && 'appBar' in (match.handle as {}))[0].handle as {appBar: {}}).appBar as {title: string, back: null | {title: string, url: string}, refresh: boolean, settings: boolean}

    let backButton: ReactElement | null;
    if (appBarParams.back) {
        const url = appBarParams.back.url
        backButton = <Tooltip title={appBarParams.back.title}>
            <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="home"
                sx={{ mr: 2 }}
                onClick={() => {
                    back(url)
                }}
            >
                <ArrowBack />
            </IconButton>
        </Tooltip>
    } else {
        backButton = null
    }

    const props: AppProperties = {
        darkMode: darkMode,
        webApp: webApp,
        userInfo: userInfo.userInfo
    }

    return (
        <div className="App">
            <AttentionAppBar title={appBarParams.title} back={backButton} settings={appBarParams.settings} loading={loading} refresh={appBarParams.refresh}
                             setLoading={(l) => {
                                 setLoading((prevState) => {
                                     return prevState || l
                                 })
                             }}/>
            <Outlet context={props}/>
        </div>
    );
}
