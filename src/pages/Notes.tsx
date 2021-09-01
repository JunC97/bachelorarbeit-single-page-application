import React, {Component} from 'react';

interface NotesProps {
    apiUrl: string
}

class Notes extends Component<NotesProps> {

    //STATE TO CHECK FOR LOADING
    state = {
        loading: true,
        title: "",
        notes: "",
        date: "",
        allNotes: []
    }

    deleteInputState = {
        delete: false
    }

    async componentDidMount() {
        const url = this.props.apiUrl + "/notes/find";
        const response = await fetch(url);
        const data = await response.json();
        //update person in state + set loading to false to show data
        this.setState({title: data.notes[0].title, notes: data.notes[0].notes, date: data.notes[0].date, loading: false,  allNotes: data.notes})
        console.log(data.notes[0].id)
        console.log(this.state.allNotes)
    }


    render() {
        const reloadNotes = async () => {
            const url = this.props.apiUrl + "/notes/find";
            const response = await fetch(url);
            const data = await response.json();
            //update person in state + set loading to false to show data
            this.setState({title: data.notes[0].title, notes: data.notes[0].notes, date: data.notes[0].date, loading: false,  allNotes: data.notes})
            console.log(data)
            console.log(this.state.allNotes)
        }

        const showAllNotes = () =>
            Array.isArray(this.state.allNotes) ? this.state.allNotes.map((note) => {
                return(
                    <div className={'noteDiv'}>
                        <div className={'noteTop'}>
                            <h4>Note {note['id']}</h4>
                            <p>{note['title']}</p>
                        </div>
                        <div className={'noteBody'}>
                            {note['note']}
                        </div>
                    </div>
                )
            }): null;

        const createNote = async () => {
            const url = this.props.apiUrl + "/notes/create?title=Test123&notes=Lorem Ipsum 234876129";
            const response = await fetch(url);
        }
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
                                <button className={'textfield_btn'} onClick={createNote}>
                                    Save
                                </button>
                            </div>
                        </div>
                        <div className={'savedNotes'}>
                            <div>
                                <h2>NOTES</h2>
                                {this.state.loading ? (
                                    <div>Loading...</div>
                                ) : (
                                    <div className={'noteDiv-wrapper'}>
                                        {showAllNotes()}
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
