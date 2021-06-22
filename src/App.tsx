import React from 'react';
import logo from './logo.svg';
import './App.css';
import Homepage from './pages/Homepage'
import Notes from "./pages/Notes";
import Navigation from "./pages/Navigation";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

function App() {
  return (
    <div>
        <Router>
            <header>
                <Navigation title={'as'} />
            </header>
            <Switch>
                <Route exact path="/" component={Homepage} />
                <Route exact path="/notes" component={Notes} />
            </Switch>
        </Router>
    </div>
  );
}

export default App;
