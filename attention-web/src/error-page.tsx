import {isRouteErrorResponse, Link, useRouteError} from "react-router-dom";
import {Button} from "react-bootstrap";

export default function ErrorPage() {
    const error = useRouteError() as any;

    if (isRouteErrorResponse(error)) {
        if (error.status === 403) {
            window.location.replace("/login")
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
