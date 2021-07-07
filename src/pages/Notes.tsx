import React, {Component} from 'react';

interface NotesProps {
    apiUrl: string
    // title?: string;
    // content?: string;
    // date?: string;
    // author?: string;
}

class Notes extends Component<NotesProps> {

    //STATE TO CHECK FOR LOADING
    state = {
        loading: true,
        title: "",
        notes: "",
        date: ""
    }

    deleteInputState = {
        delete: false
    }

    async componentDidMount() {
        const url = this.props.apiUrl + "/notes/find";
        const response = await fetch(url);
        const data = await response.json();
        //update person in state + set loading to false to show data
        this.setState({title: data.notes[0].title, notes: data.notes[0].notes, date: data.notes[0].date, loading: false})
        console.log(data.notes[0].id)
    }


    render() {
        //const { title, subtitle, children } = this.props;
        const reloadNotes = async () => {
            const url = this.props.apiUrl + "/notes/find";
            const response = await fetch(url);
            const data = await response.json();
            //update person in state + set loading to false to show data
            this.setState({title: data.notes[0].title, notes: data.notes[0].notes, date: data.notes[0].date, loading: false})
            console.log(data.notes[0].id)
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
                                {this.state.loading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div>
                                        <div>
                                            {this.state.title} <br/>
                                            {this.state.notes}
                                        </div>
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