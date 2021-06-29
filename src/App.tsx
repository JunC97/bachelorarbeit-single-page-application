import React from 'react';
import logo from './logo.svg';
import './App.css';
import './css/notes.css';
import './css/navigation.css';
import './css/home.css';
import './css/general.css';
import './css/footer.css';

import Homepage from './pages/Homepage'
import Notes from "./pages/Notes";
import Navigation from "./pages/Navigation";
import FooterBar from "./pages/FooterBar";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

function App() {
  return (
    <div>
        <Router>
            <header>
                <Navigation title={'navigation'} />
            </header>
            <div className={'main'}>
                <Switch>
                    <Route exact path="/" component={Homepage} />
                    <Route exact path="/notes" component={Notes} />
                </Switch>
            </div>
            <footer>
                <FooterBar title={'footer'}/>
            </footer>
        </Router>
    </div>
  );
}

export default App;
