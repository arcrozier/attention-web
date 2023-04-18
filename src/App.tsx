import React, {ReactElement, useEffect, useRef, useState} from 'react';
import './App.css';
import {
    defer,
    Outlet, redirect,
    useLoaderData, useLocation,
    useMatches,
    useOutletContext
} from "react-router-dom";
import {APIResult, getUserInfo, registerDevice} from "./utils/repository";
import {Properties, useBack, useLogout, useProps as useRootProps} from "./Root";
import {AxiosError, AxiosResponse} from "axios";
import {initializeApp} from 'firebase/app';
import {getMessaging, getToken} from "firebase/messaging";
import {AttentionAppBar} from "./utils/AttentionAppBar";
import {IconButton, Tooltip} from "@mui/material";
import {ArrowBack} from "@mui/icons-material";

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

    const userInfo = useLoaderData() as { userInfo: Promise<AxiosResponse<APIResult<UserInfo>>> }

    const {darkMode, webApp} = useRootProps()

    const props: AppProperties = {
        darkMode: darkMode,
        webApp: webApp,
        userInfo: userInfo.userInfo
    }

    const [loading, setLoading] = useState(true)

    const logout = useLogout()

    const location = useLocation()

    useEffect(() => {
        userInfo.userInfo?.then(() => {
            setLoading(false)
        }).catch((error: { response: AxiosResponse | undefined | null, request: any }) => {
            setLoading(false)
            if (error.response && error.response.status === 403) {
                logout(true, `${location.pathname}${location.search}`)
            } else {
                throw(error)
            }
        })
    }, [userInfo.userInfo, logout, location.pathname, location.search])

    const matches = useMatches()

    const back = useBack()

    const appBarParams = matches.filter((match) => match.handle && 'title' in (match.handle as {}))[0].handle as {title: string, back: null | {title: string, url: string}, refresh: boolean, settings: boolean}

    const backButton = useRef<ReactElement | null>(null)
    useEffect(() => {
        if (appBarParams.back) {
            const url = appBarParams.back.url
            backButton.current = <Tooltip title={appBarParams.back.title}>
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
        }
    }, [appBarParams.back, back])



    return (
        <div className="App">
            <AttentionAppBar title={appBarParams.title} back={backButton.current} settings={appBarParams.settings} loading={loading} refresh={appBarParams.refresh}
                             setLoading={(l) => {
                                 setLoading((prevState) => {
                                     return prevState || l
                                 })
                             }}/>
            <Outlet context={props}/>
        </div>
    );
}
