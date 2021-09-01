import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
interface FooterBarProps {
    title?: string;
    subtitle?: string;
}

class FooterBar extends Component<FooterBarProps> {
    render() {
        return (
            <>
                <nav className={'footer'}>
                    <div className={'footerDiv'}>
                        <Link to="/">
                            <h2>NotiTiger</h2>
                        </Link>
                        <ul>
                        </ul>
                        <p>All Rights Reserved | &copy; NotiTiger</p>
                    </div>
                </nav>
            </>
        );
    }
}

export default FooterBar;
