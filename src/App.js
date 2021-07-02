import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Games from './pages/Games';
import Generator from './pages/Generator';

function App() {
    return (
        <Router>
            <Switch>
                <Route path="/games" exact component={Games}/>
                <Route path="/generator" exact component={Generator}/>
            </Switch>
        </Router>
    );
}

export default App;
