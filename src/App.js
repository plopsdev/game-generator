import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import './App.css';
import Games from './pages/Games';
import Generator from './pages/Generator';
import Authentication from './pages/Authentication';
import Confirmation from './pages/Confirmation';
import './styles/general.css'

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={Authentication} />
                <Route path="/games" exact component={Games}/>
                <Route path="/generator" exact component={Generator}/>
                <Route path="/confirmation" exact component={Confirmation} />
            </Switch>
        </Router>
    );
}

export default App;
