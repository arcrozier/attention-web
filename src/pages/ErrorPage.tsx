import {Link, useNavigate, useRouteError} from "react-router-dom";
import {AxiosError} from "axios";
import {useEffect} from "react";

export default function ErrorPage() {
    const error = useRouteError() as any;
    const navigate = useNavigate()

    useEffect(() => {
        if (error instanceof AxiosError) {
            if (error.response?.status === 403) {
                navigate('/login', {replace: true})
            }
        }
    }, [error, navigate])


    if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
            return (<div id={"error-page"}>
                <p>Taking you to the <Link to={"/login"}>login page</Link>...</p>
            </div>)
        }
    }

    return (
        <div id="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error has occurred.</p>
            <p>
                <i>{error.statusText || error.message}</i>
            </p>
            <Link className={'btn btn-primary'} to={'/'} >Go Home</Link>
        </div>
    );
}
