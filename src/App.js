import React from 'react';
import logo from './logo.svg';
import './App.css';

import {BrowserRouter as HashRouter, Route, Switch, NavLink} from 'react-router-dom';
import Home from './form/Home';
import CarList from './form/CarList';
import CarEdit from './form/CarEdit';
import HotelList from './form/HotelList';
import HotelEdit from './form/HotelEdit';
import ViewList from './form/ViewList';
import ViewEdit from './form/ViewEdit';

function App() {
    return (

        <HashRouter>
            <div>
                <h1>Westar Travel Demo Application</h1>

                <div className="content">
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/car" component={CarList}/>
                    <Route exact path="/car/:id" component={CarEdit}/>
                    <Route exact path="/hotel" component={HotelList}/>
                    <Route exact path="/hotel/:id" component={HotelEdit}/>
                    <Route exact path="/view" component={ViewList}/>
                    <Route exact path="/view/:id" component={ViewEdit}/>
                </div>
            </div>
        </HashRouter>
    );
}

export default App;
