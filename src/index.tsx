import React, {Suspense} from 'react';
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

// TODO more granular Suspense elements
const router = createBrowserRouter([
    {
        path: "/",
        async lazy () {
            const [{Root}, {ErrorPage}] = await Promise.all([import('./Root'), import('./pages/ErrorPage')])
            return {Component: Root, ErrorBoundary: ErrorPage}
        },
        children: [
            {
                async lazy () {
                    const {App, userInfoLoader} = await import('./App')
                    return {Component: App, loader: userInfoLoader}
                },
                children: [
                    {
                        index: true,
                        path: ":add?/",
                        async lazy () {
                            const {Home} = await import('./pages/Home');
                            return {Component: Home}
                        },
                        handle: {
                            title: "Attention!",
                            back: null,
                            settings: true,
                            refresh: true
                        }
                    },
                    {
                        path: "settings/",
                        async lazy () {
                            const {Settings} = await import('./pages/Settings')
                            return {Component: Settings}
                        },
                        handle: {
                            title: "Settings",
                            back: {
                                tooltip: "Home",
                                url: "/"
                            },
                            settings: false,
                            refresh: false
                        }
                    }
                ]
            },
            {
                path: "login/",
                async lazy () {
                    const {AuthRoot} = await import('./pages/Login')
                    return {Component: AuthRoot}
                },
                children: [
                    {
                        index: true,
                        async lazy () {
                            const {Login} = await import('./pages/Login')
                            return {Component: Login}
                        },
                    },
                    {
                        path: "create-account/",
                        async lazy () {
                            const {CreateAccount} = await import('./pages/Login')
                            return {Component: CreateAccount}
                        },
                    },
                    {
                        path: "choose-username/"
                    }
                ]
            }
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

