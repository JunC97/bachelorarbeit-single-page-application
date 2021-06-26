import React, {Component} from 'react';

interface NotesProps {
    title: string;
    content: string;
    date: string;
    author: string;
}
class Notes extends Component<NotesProps> {
    render() {
        //const { title, subtitle, children } = this.props;
        return (
            <>
                <div className={'center3'}>
                    <div className={'noteBox'}>
                        <div className={'notesWrapper'}>
                            <h1 id={'create_note_title'}>Take some notes</h1>
                            <textarea name="comment" id={'textArea'} placeholder={'Enter text here'}>

                            </textarea>
                        </div>
                        <div className={'item2'}>
                            <p>NOTES</p>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Notes;