import React, {createRef, Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './animations.css';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

export const ROOT_ID = "root"
export const APP_ID = "app"
export const HOME_ID = "home"
export const SETTINGS_ID = "settings"
export const AUTH_ID = "auth"

// TODO more granular Suspense elements
const router = createBrowserRouter([
    {
        path: "/",
        id: ROOT_ID,
        async lazy () {
            const [{Root}, {ErrorPage}] = await Promise.all([import('./Root'), import('./pages/ErrorPage')])
            return {Component: Root, ErrorBoundary: ErrorPage}
        },
        handle: {
            ref: createRef()
        },
        children: [
            {
                async lazy () {
                    const {App, userInfoLoader} = await import('./App')
                    return {Component: App, loader: userInfoLoader}
                },
                id: APP_ID,
                handle: {
                    ref: createRef()
                },
                children: [
                    {
                        index: true,
                        path: ":add?/",
                        id: HOME_ID,
                        async lazy () {
                            const {Home} = await import('./pages/Home');
                            return {Component: Home}
                        },
                        handle: {
                            appBar: {
                                title: "Attention!",
                                back: null,
                                settings: true,
                                refresh: true,
                            },
                            ref: createRef()
                        },
                    },
                    {
                        path: "settings/",
                        id: SETTINGS_ID,
                        async lazy () {
                            const {Settings} = await import('./pages/Settings')
                            return {Component: Settings}
                        },
                        handle: {
                            appBar: {
                                title: "Settings",
                                back: {
                                    tooltip: "Home",
                                    url: "/"
                                },
                                settings: false,
                                refresh: false,
                            },
                            ref: createRef()
                        },
                    },
                ]
            },
            {
                path: "login/",
                id: AUTH_ID,
                async lazy () {
                    const {AuthRoot} = await import('./pages/Login')
                    return {Component: AuthRoot}
                },
                handle: {
                    ref: createRef()
                },
                children: [
                    {
                        index: true,
                        async lazy () {
                            const {Login} = await import('./pages/Login')
                            return {Component: Login}
                        },
                        handle: {
                            ref: createRef()
                        },
                    },
                    {
                        path: "create-account/",
                        async lazy () {
                            const {CreateAccount} = await import('./pages/Login')
                            return {Component: CreateAccount}
                        },
                        handle: {
                            ref: createRef()
                        },
                    },
                    {
                        path: "choose-username/",
                        handle: {
                            ref: createRef()
                        },
                    },
                ]
            },
        ]
    }

]);

// https://ui.dev/react-router-code-splitting
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <Suspense fallback={null}>
            <RouterProvider router={router} />
        </Suspense>
    </React.StrictMode>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

