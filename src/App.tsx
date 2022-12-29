import React from 'react';
import './App.css';
import {Outlet, useLoaderData, useOutletContext} from "react-router-dom";
import {getUserInfo} from "./utils/repository";
import {Properties, useProps as useRootProps} from "./Root";

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
    id: string,
    name: string,
    sent: number,
    received: number,
    last_message_sent_id: string | null,
    last_message_status: MESSAGE_STATUS | null,
    photo: string
}

export interface UserInfo {
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    password: boolean,
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

    const userInfo = useLoaderData() as UserInfo | null

    const {darkMode, webApp} = useRootProps()

    const props: AppProperties = {
        darkMode: darkMode,
        webApp: webApp,
        userInfo: userInfo
    }

    return (
        <div className="App">
            <Outlet context={props}/>
        </div>
    );
}

export default App;
