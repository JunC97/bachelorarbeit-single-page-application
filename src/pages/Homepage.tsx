import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

interface HomepageProps {
    title: string;
    subtitle?: string;
}

class Homepage extends Component<HomepageProps> {
    render() {
        //const { title, subtitle, children } = this.props;
        return (
            <>
                <div className={'flex-container-row'}>
                    <div className={'welcome-box-left'}>
                        <p>asdasd</p>
                    </div>
                    <div className={'center welcome'}>
                        <h1>Welcome to NotiTiger</h1>
                        <p>Where your notes are safe! Even from a Tiger...</p>
                        <h3>Get started now!</h3>
                        <Link to="/notes" className={'link-important'}>Create Note</Link>
                    </div>
                    <div className={'welcome-box-right'}>
                        <p>asdasd</p>
                    </div>
                </div>
                <div className={'center'}>
                    <div className={'flex-container-row'}>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>

                                <h1>Create Note</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus dolorum facilis
                                    ipsa
                                    ipsam mollitia nobis nulla possimus quia sequi? Nihil?</p>

                            </div>
                        </Link>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>

                                <h1>My Notes</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci aliquid, amet
                                    dolorum
                                    ducimus esse maxime nam quisquam quo repudiandae!</p>
                            </div>
                        </Link>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>
                                <h1>Info</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus excepturi harum
                                    labore
                                    minima non officia quod vero! Consequatur, debitis nesciunt.</p>
                            </div>
                        </Link>
                    </div>
                    <div className={'flex-container-row'}>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>
                                <h1>About</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, cum dolore
                                    eaque
                                    itaque
                                    molestias nemo praesentium quae quidem quis voluptates.</p>

                            </div>
                        </Link>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>

                                <h1>Getting Started</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consequatur
                                    debitis
                                    nobis
                                    unde. Aliquid assumenda autem deserunt enim saepe! Error.</p>
                            </div>
                        </Link>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>
                                <h1>Contact</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur delectus eius
                                    enim,
                                    expedita ipsa libero molestiae necessitatibus obcaecati sint vitae!</p>
                            </div>
                        </Link>
                    </div>

                </div>
                <div className={'center tiles2'}>


                </div>
            </>
        );
    }
}

export default Homepage;