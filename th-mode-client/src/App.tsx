import React from 'react';
import './App.css';
import MainNavigation from "./components/navigations/MainNavigation";
import {BrowserRouter} from "react-router-dom";
import {LocalStorageContext} from "./contexts/LocalStorageContext";
import {LocalStorage} from "./utils/LocalStorage";

function App() {

    return (
        <BrowserRouter>
            <LocalStorageContext.Provider value={new LocalStorage()}>
                <MainNavigation/>
            </LocalStorageContext.Provider>
        </BrowserRouter>
    );
}

export default App;
