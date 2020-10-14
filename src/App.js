import React from 'react';
import logo from './logo.svg';
import './App.css';

import { BrowserRouter as HashRouter, Route, Switch, NavLink} from 'react-router-dom';
import Home from './form/Home';
import CarList from './form/CarList';
import CarEdit from './form/CarEdit';

function App() {
  return (

      <HashRouter>
        <div>
          <h1>Westar Travel Demo Application</h1>

          <div className="content">
            <Route exact path="/" component={Home}/>
            <Route exact path="/car" component={CarList}/>
            <Route exact path="/car/:id" component={CarEdit}/>
          </div>
        </div>
      </HashRouter>
  );
}

export default App;
