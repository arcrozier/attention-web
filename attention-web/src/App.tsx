import React, {useState} from 'react';
import './colors.scss'
import './App.css';
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
        <Outlet context={{darkMode: darkMode}}/>
    </div>
  );
}

export default App;
