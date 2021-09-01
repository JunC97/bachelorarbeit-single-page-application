import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

interface HomepageProps {
     apiUrl: string;
}

class Homepage extends Component<HomepageProps> {
    state = {
        loading: true,
        title: "",
        notes: "",
        date: ""
    }

    //FETCH DATA HERE
    //MAKE SURE ONLY FETCHED ONCE WITH COMPONENTDIDMOUNT
    async componentDidMount() {
        const url = this.props.apiUrl + "/notes/find/most_recent";
        const response = await fetch(url);
        const data = await response.json();
        //update person in state + set loading to false to show data
        this.setState({title: data.notes[0].title, notes: data.notes[0].notes, date: data.notes[0].date, loading: false})
        console.log(data.notes[0].id)
    }

    render() {
        return (
            <>
                <div className={'flex-container-row'}>
                    <div className={'welcome-box-left'}>
                        <p></p>
                    </div>
                    <div className={'center welcome'}>
                        <h1>Welcome to NotiTiger</h1>
                        <p>Where your notes are safe! Even from a Tiger...</p>
                        <h3>Get started now!</h3>
                        <Link to="/notes" className={'link-important'}>Create Note</Link>
                    </div>
                    <div className={'welcome-box-right'}>
                        <p></p>
                    </div>
                </div>
                <div className={'center'}>
                    <div className={'flex-container-row'}>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>

                                <h1>Create Note</h1>
                                <p>Afraid of forgetting something important? Don't worry we got you covered! Add a new note now!</p>

                            </div>
                        </Link>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>

                                <h1>My Notes</h1>
                                {this.state.loading ? (
                                    <p>Fetching your most recent note...</p>
                                ) : (
                                    <p>Most Recently Created:</p>
                                )}
                                {this.state.loading ? (
                                    <p>loading...</p>
                                    ) : (
                                        <p>{this.state.title}</p>
                                )}
                            </div>
                        </Link>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>
                                <h1>Info</h1>
                                <p>NotiTiger is a Single-Page-Application that provides note taking capabilities for everyone anywhere.</p>
                            </div>
                        </Link>
                    </div>
                    <div className={'flex-container-row'}>
                        <Link to="/about" className={'tileLink'}>
                            <div className={'tile'}>
                                <h1>About</h1>
                                <p>Check our about section. Follow this tile!</p>

                            </div>
                        </Link>
                        <Link to="/notes" className={'tileLink'}>
                            <div className={'tile'}>

                                <h1>Getting Started</h1>
                                <p>Click this tile to create your first note! It is simple... just type in what you want to safe an done!</p>
                            </div>
                        </Link>
                        <Link to="/contact" className={'tileLink'}>
                            <div className={'tile'}>
                                <h1>Contact</h1>
                                <p>Contact us now! Click this tile to talk to us. We are happy to help you or receive feedback!</p>
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
