import React, {useState} from 'react';
import logo from './icon.svg';
import gear from './settings.svg';
import './App.css';
import {Button, Container, Navbar} from "react-bootstrap";
import {Outlet, useOutletContext} from "react-router-dom";

export interface Properties {
    darkMode: boolean
}

export function useProps() {
    return useOutletContext<Properties>()
}

function App() {
  const [darkMode, setDarkMode] = useState(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
    setDarkMode(e.matches)
  });

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
            </Container>
        </Navbar>
        <Outlet context={{darkMode: darkMode}}/>
    </div>
  );
}

export default App;
