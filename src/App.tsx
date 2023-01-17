import React from 'react';
import './App.css';
import {
    Outlet,
    useLoaderData,
    useOutletContext
} from "react-router-dom";
import {APIResult, getUserInfo} from "./utils/repository";
import {Properties, useProps as useRootProps} from "./Root";
import {AxiosResponse} from "axios";

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

function App() {

    const userInfo = useLoaderData() as AxiosResponse<APIResult<UserInfo>>

    const {darkMode, webApp} = useRootProps()

    const props: AppProperties = {
        darkMode: darkMode,
        webApp: webApp,
        userInfo: userInfo.data.data
    }

    // TODO on launch, try to register the device

    return (
        <div className="App">
            <Outlet context={props}/>
        </div>
    );
}

export default App;
