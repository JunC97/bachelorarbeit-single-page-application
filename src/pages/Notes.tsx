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
                <div className={'center2'}>
                    <div className={'item1'}>
                        <h1 id={'create_note_title'}>Take some notes:</h1>
                        <textarea name="comment" id={'textArea'}>Enter text here...</textarea>
                    </div>
                    <div className={'item2'}>
                        <p>TEST</p>
                    </div>
                </div>
            </>
        );
    }
}

export default Notes;