import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
interface NavigationProps {
    title?: string;
    subtitle?: string;
}

class Navigation extends Component<NavigationProps> {
    render() {
        return (
            <>
                <nav className={'nav'}>
                    <div className='flex-container'>
                        <div className={'title'}>
                            <Link to="/"><h2>NotiTiger</h2></Link>
                        </div>
                        <div className='flex-container-inner'>
                                <Link to="/">Home</Link>
                                <Link to="/notes">Notes</Link>
                                <Link to="/contact">Contact</Link>
                                <Link to="/about">About</Link>
                        </div>
                    </div>
                </nav>
            </>
        );
    }
}

export default Navigation;
