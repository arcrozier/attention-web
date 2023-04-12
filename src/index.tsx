import React, {Suspense} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import './animations.css';
import App, {userInfoLoader as rootLoader} from './App';
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

const AuthRoot = React.lazy(() => import('./pages/Login').then((c) => ({default: c.AuthRoot})))
const Login = React.lazy(() => import('./pages/Login').then((c) => ({default: c.Login})))
const CreateAccount = React.lazy(() => import('./pages/Login').then((c) => ({default: c.CreateAccount})))
const Root = React.lazy(() => import('./Root'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Home = React.lazy(() => import('./pages/Home'))

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                // todo somehow get add/?username=<username> to work
                path: "/",
                element: <App />,
                loader: rootLoader,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: "settings/",
                        element: <Settings />
                    }
                ]
            },
            {
                path: "login/",
                element: <AuthRoot />,
                children: [
                    {
                        index: true,
                        element: <Login />
                    },
                    {
                        path: "create-account/",
                        element: <CreateAccount />
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
        <Suspense fallback={<p>Loading...</p>}>
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

