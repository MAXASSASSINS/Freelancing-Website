import React, { useEffect, useState } from 'react'
import { Editor, EditorState, RichUtils } from 'draft-js';
import '../../../node_modules/draft-js/dist/Draft.css';
import './test.css';
import { AiOutlineBold, AiOutlineItalic } from 'react-icons/ai';

export const Test = () => {
    const [editorState, setEditorState] = React.useState(
        () => EditorState.createEmpty(),
    );

    const handleChange = (editorState) => {
        setEditorState(editorState);
    };


    const handleBoldClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'BOLD'));
    };

    const handleItalicClick = () => {
        setEditorState(RichUtils.toggleInlineStyle(editorState, 'ITALIC'));
    };




    return (
        <div className=''>
            <button onClick={handleBoldClick}>
                <AiOutlineBold></AiOutlineBold>
            </button>


            <button onClick={handleItalicClick}>
                <AiOutlineItalic></AiOutlineItalic>
            </button>

            <Editor
                editorState={editorState}
                onChange={handleChange}
            />
        </div>
    );
}
