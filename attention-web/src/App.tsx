import React, {useState} from 'react';
import logo from './icon.svg';
import gear from './settings.svg';
import './App.css';
import {Button, Container, Navbar} from "react-bootstrap";

function openSettings() {
    // TODO
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
                <Navbar.Text className={"justify-content-end"}>
                    <button onClick={openSettings}>
                        <img src={gear} alt={"Settings"}/>
                    </button>
                </Navbar.Text>
            </Container>
        </Navbar>
    </div>
  );
}

export default App;
