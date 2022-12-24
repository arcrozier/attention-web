import {useEffect, useState} from "react";
import {useOutletContext, Outlet} from "react-router-dom";


export interface Properties {
    darkMode: boolean,
    webApp: boolean
}

export function useProps() {
    return useOutletContext<Properties>()
}

export default function Root() {
    const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
    const isWebApp = (window.matchMedia('(display-mode: standalone)').matches);
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        setDarkMode(e.matches)
    });

    const props: Properties = {
        darkMode: darkMode,
        webApp: isWebApp
    }

    return (
        <div id={"root"}>
            <Outlet context={props} />
        </div>
    )
}


export function useTitle(webApp: boolean, page: string) {
    useEffect(() => {
        document.title = (webApp ? '' : 'Attention! ') + page
    })
}
