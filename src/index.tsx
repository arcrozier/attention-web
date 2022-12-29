import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App, {userInfoLoader as rootLoader} from './App';
import Login, {AuthRoot} from './pages/Login'
import reportWebVitals from './reportWebVitals';
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import Settings from "./pages/Settings";
import Root from "./Root";
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const router = createBrowserRouter([
    {
        path: "/",
        element: <Root />,
        errorElement: <ErrorPage />,
        children: [
            {
                path: "/",
                element: <App />,
                loader: rootLoader,
                children: [
                    {
                        index: true,
                        element: <Home />
                    },
                    {
                        path: "/settings",
                        element: <Settings />
                    }
                ]
            },
            {
                path: "/login",
                element: <AuthRoot />,
                children: [
                    {
                        index: true,
                        element: <Login />
                    },
                    {
                        path: "/create-account"
                    },
                    {
                        path: "/choose-username"
                    }
                ]
            }
        ]
    }

]);

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
