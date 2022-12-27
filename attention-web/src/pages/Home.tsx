import React from "react";
import {Container, Navbar} from "react-bootstrap";
import {Settings, Logo} from "../utils/images";
import {useProps} from "../App";
import {Link} from "react-router-dom";
import {useTitle} from "../Root";


function Home() {

    const {darkMode, webApp} = useProps()

    useTitle(webApp, 'Home')

    // TODO reload?

    // TODO replace navbar with app bar:
    // https://mui.com/material-ui/getting-started/usage/
    return (
        <div className="App">
            <Navbar bg={"primary"} variant={darkMode ? "light" : "dark"} sticky={"top"}>
                <Container>
                    <Navbar.Brand href="#home">
                        <Logo width={"30px"} height={"30px"} className={"d-inline-block align-top"}/>
                        Attention
                    </Navbar.Brand>
                    <Navbar.Text className={"justify-content-end"}>
                        <Link className={'btn btn-primary day-night'} to={`settings`}>
                                <Settings />
                            </Link>
                    </Navbar.Text>
                </Container>
            </Navbar>
            <p>Home!</p>
        </div>
    );
}

export default Home
