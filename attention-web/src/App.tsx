import React, {useEffect, useState} from 'react';
import './colors.scss'
import './App.css';
import {Outlet, useLoaderData, useOutletContext} from "react-router-dom";
import {getUserInfo} from "./repository";

// TODO https://create-react-app.dev/docs/making-a-progressive-web-app/
// offline support - support cached friends? No
export interface Properties {
    darkMode: boolean,
    webApp: boolean,
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
    return useOutletContext<Properties>()
}

export function useTitle(webApp: boolean, page: string) {
    useEffect(() => {
        document.title = (webApp ? '' : 'Attention! ') + page
    })
}

function App() {
  const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const isWebApp = (window.matchMedia('(display-mode: standalone)').matches);
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setDarkMode(e.matches)
  });

  const userInfo = useLoaderData() as UserInfo | null

  const props: Properties = {
      darkMode: darkMode,
      webApp: isWebApp,
      userInfo: userInfo
  }

  return (
    <div className="App">
        <Outlet context={props}/>
    </div>
  );
}

export default App;
