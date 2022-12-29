import React from "react";
import {useProps} from "../App";
import {useTitle} from "../Root";


function Home() {

    const {webApp, userInfo} = useProps()

    console.log(userInfo)

    useTitle(webApp, 'Home')

    // TODO reload?

    // TODO replace navbar with app bar:
    // https://mui.com/material-ui/getting-started/usage/
    return (
        <div className="App">
            <p>Home!</p>
        </div>
    );
}

export default Home
