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
                <div className={'center welcome'}>
                    <h1>Welcome to NotiTiger</h1>
                    <p>Where your notes are safe! Even from a Tiger...</p>
                    <h3>Get started now!</h3>
                    <Link to="/notes" className={'link-important'}>Create Note</Link>
                </div>

                <div className={'center tiles'}>
                    <div className={'createNote tile'}>
                        <div>
                            <Link to="/notes" className={'tileLink'}>
                        <h1>Create Note</h1>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus dolorum facilis ipsa
                            ipsam mollitia nobis nulla possimus quia sequi? Nihil?</p>
                            </Link>
                        </div>
                    </div>
                    <div className={'myNotes tile'}>
                        <div>
                            <Link to="/notes" className={'tileLink'}>
                                <h1>My Notes</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab adipisci aliquid, amet
                                    dolorum
                                    ducimus esse maxime nam quisquam quo repudiandae!</p>
                            </Link>
                        </div>
                    </div>
                    <div className={'info tile'}>
                        <div>
                            <Link to="/notes" className={'tileLink'}>
                                <h1>Info</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Doloribus excepturi harum
                                    labore
                                    minima non officia quod vero! Consequatur, debitis nesciunt.</p>
                            </Link>
                        </div>
                    </div>
                    <div className={'about tile'}>
                        <div>
                            <Link to="/notes" className={'tileLink'}>
                                <h1>About</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Asperiores, cum dolore
                                    eaque
                                    itaque
                                    molestias nemo praesentium quae quidem quis voluptates.</p>
                            </Link>
                        </div>
                    </div>
                    <div className={'gettingStarted tile'}>
                        <Link to="/notes" className={'tileLink'}>
                        <div>

                                <h1>Getting Started</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci consequatur debitis
                                    nobis
                                    unde. Aliquid assumenda autem deserunt enim saepe! Error.</p>

                        </div>
                        </Link>
                    </div>
                    <div className={'contact tile'}>
                        <div>
                            <Link to="/notes" className={'tileLink'}>
                                <h1>Contact</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aspernatur delectus eius enim,
                                    expedita ipsa libero molestiae necessitatibus obcaecati sint vitae!</p>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className={'center tiles2'}>


                </div>
            </>
        );
    }
}

export default Homepage;