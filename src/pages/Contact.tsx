import React, {Component} from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

interface ContactProps {
    //title?: string
    // subtitle?: string;
    apiUrl: string;
}

class Contact extends Component<ContactProps> {
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
        //const { title, subtitle, children } = this.props;
        return (
            <>
                <div className={'flex-container-row'}>
                    <div className={'welcome-box-left'}>
                        <p></p>
                    </div>
                    <div className={'center welcome'}>
                        <h1>Contact NotiTiger</h1>
                        <p>We are happy to hear from you! Contact us now: contact@notitiger.com</p>
                        <h3>Get started now!</h3>
                        <Link to="/notes" className={'link-important'}>Create Note</Link>
                    </div>
                    <div className={'welcome-box-right'}>
                        <p></p>
                    </div>
                </div>
            </>
        );
    }
}

export default Contact;