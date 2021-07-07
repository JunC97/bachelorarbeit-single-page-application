import React, {Component} from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
interface FooterBarProps {
    title?: string;
    subtitle?: string;
}

class FooterBar extends Component<FooterBarProps> {
    render() {
        //const { title, subtitle, children } = this.props;
        return (
            <>
                <nav className={'footer'}>
                    TEST
                </nav>
            </>
        );
    }
}

export default FooterBar;