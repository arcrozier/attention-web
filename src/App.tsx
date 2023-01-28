import React, {useEffect} from 'react';
import './App.css';
import {
    Outlet,
    useLoaderData,
    useOutletContext
} from "react-router-dom";
import {APIResult, getUserInfo} from "./utils/repository";
import {Properties, useProps as useRootProps} from "./Root";
import {AxiosResponse} from "axios";

const ICON_URL = process.env.PUBLIC_URL + '/icon.svg'

// TODO https://create-react-app.dev/docs/making-a-progressive-web-app/
// offline support - support cached friends? No

export interface AppProperties extends Properties {
    userInfo: UserInfo | null
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

export async function userInfoLoader() {
    return await getUserInfo()
}

export function useProps() {
    return useOutletContext<AppProperties>()
}

export function notify(title: string, options: NotificationOptions | undefined = undefined, onclick: ((this: Notification, ev: Event) => any) | null = null): boolean {
    // set defaults
    options = {...{badge: ICON_URL, icon: ICON_URL, renotify: true}, ...options}
    if (!("Notification" in window)) {
        return false
    } else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        const notification = new Notification(title, options)
        notification.onclick = onclick
        return true
    } else if (Notification.permission !== "denied") {
        // We need to ask the user for permission
        Notification.requestPermission().then((permission) => {
            // If the user accepts, let's create a notification
            if (permission === "granted") {
                const notification = new Notification(title, options);
                notification.onclick = onclick
            }
        });
    }
    return false
}

function requestNotificationPermission() {
    if (!("Notification" in window)) {
        // Check if the browser supports notifications
        return
    } else if (Notification.permission !== "denied" && Notification.permission !== "granted") {
        // We need to ask the user for permission
        Notification.requestPermission().then()
    }
}

function App() {

    const userInfo = useLoaderData() as AxiosResponse<APIResult<UserInfo>>

    const {darkMode, webApp} = useRootProps()

    const props: AppProperties = {
        darkMode: darkMode,
        webApp: webApp,
        userInfo: userInfo.data.data
    }

    useEffect(() => {
        if (userInfo !== null) {
            requestNotificationPermission()
        }
    }, [userInfo])

    // TODO on launch, try to register the device

    return (
        <div className="App">
            <Outlet context={props}/>
        </div>
    );
}

export default App;
