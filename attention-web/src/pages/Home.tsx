import React, {useState} from "react";
import {Button, Container, Navbar} from "react-bootstrap";
import logo from "../icon.svg";
import gear from "../settings.svg";
import {Properties, useProps} from "../App";
import {Link} from "react-router-dom";


function Home() {

    const {darkMode} = useProps()

    return (
        <div className="App">
            <Navbar bg={"primary"} variant={darkMode ? "dark" : "light"} sticky={"top"}>
                <Container>
                    <Navbar.Brand href="#home">
                        <img
                            alt=""
                            src={logo}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        Attention
                    </Navbar.Brand>
                    <Navbar.Text className={"justify-content-end"}>
                        <Button>
                            <Link to={`settings`}>
                                <img src={gear} alt={"Settings"}/>
                            </Link>
                        </Button>
                    </Navbar.Text>
                </Container>
            </Navbar>
            <p>Home!</p>
        </div>
    );
}

export default Home
