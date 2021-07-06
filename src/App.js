import './App.css';
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Games from './pages/Games';
import Generator from './pages/Generator';
import Authentication from './pages/Authentication';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/games" exact component={Games}/>
                <Route path="/generator" exact component={Generator}/>
                <Route patj="/authentication" exact component={Authentication} />
            </Switch>
        </Router>
    );
}

export default App;
