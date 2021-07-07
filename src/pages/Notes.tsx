import React, {Component} from 'react';

interface NotesProps {
    title: string;
    content: string;
    date: string;
    author: string;
}

class Notes extends Component<NotesProps> {

    //STATE TO CHECK FOR LOADING
    state = {
        loading: true,
        person: null
    }

    deleteInputState = {
        delete: false
    }

    //FETCH DATA HERE
    //MAKE SURE ONLY FETCHED ONCE WITH COMPONENTDIDMOUNT
    // async componentDidMount() {
    //     const url = "https://api.randomuser.me/";
    //     const response = await fetch(url);
    //     const data = await response.json();
    //     //update person in state + set loading to false to show data
    //     this.setState({person: data.results[0], loading: false})
    // }


    render() {
        //const { title, subtitle, children } = this.props;
        const reloadNotes = async () => {
            const url = "https://api.randomuser.me/";
            const response = await fetch(url);
            const data = await response.json();
            //update person in state + set loading to false to show data
            this.setState({person: data.results[0], loading: false})
        }
        // @ts-ignore
        return (
            <>
                <div className={'center3'}>
                    <div className={'noteBox'}>
                        <div className={'notesWrapper'}>
                            <h1 id={'create_note_title'}>Take some notes</h1>
                            <textarea name="comment" id={'textArea'} placeholder='Enter text here'>

                            </textarea>
                            <div className={'textfield_btns_wrapper'}>
                                <button className={'textfield_btn'}>
                                    Cancel
                                </button>
                                <button className={'textfield_btn'}>
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className={'savedNotes'}>
                            <div>
                                <p>NOTES</p>
                                {this.state.loading || !this.state.person ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div>
                                        <div>
                                            {this.state.person.name.first} <br/>
                                            {this.state.person.name.last}
                                        </div>
                                        <img src={this.state.person.picture.large} alt=""/>
                                    </div>
                                )}
                            </div>
                            <div className={'savedNotesRefreshBtn'}>
                                <button onClick={reloadNotes} className={'refreshBtn'}>
                                    Reload
                                </button>
                            </div>
                        </div>
                    </div>
                    {/*<div className={'savedNotes'}>*/}
                    {/*    asd*/}
                    {/*</div>*/}
                </div>
            </>
        );
    }
}

export default Notes;