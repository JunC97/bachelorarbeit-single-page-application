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
import About from "./pages/About";
import Contact from "./pages/Contact";
import Navigation from "./pages/Navigation";
import FooterBar from "./pages/FooterBar";
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';

const apiUrl = "https://ayj4r2rfcc.execute-api.eu-west-1.amazonaws.com/dev"

function App() {
  return (
    <div>
        <Router>
            <header>
                <Navigation title={'navigation'} />
            </header>
            <div className={'main'}>
                <Switch>
                    <Route exact path="/" component={() => <Homepage apiUrl={apiUrl} />}/>
                    <Route exact path="/notes" component={() => <Notes apiUrl={apiUrl} />} />
                    <Route exact path="/about" component={() => <About apiUrl={apiUrl} />} />
                    <Route exact path="/contact" component={() => <Contact apiUrl={apiUrl} />} />
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
