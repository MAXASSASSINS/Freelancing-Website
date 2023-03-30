import { fontSize } from '@mui/system';
import React, { useState, useEffect, forwardRef, useImperativeHandle } from 'react'
import './textArea.css'

export const TextArea = forwardRef(({ maxLength, minLength, style, placeholder, 
    defaultText, warning, reference, getText} , ref) => {

        
    const [currentTextLength, setCurrentTextLength] = useState(defaultText ? defaultText.length : 0);
    const [text, setText] = useState(defaultText ? defaultText : "");
    
    const handleChange = (e) => {
        setCurrentTextLength(e.target.value.trim().length);
        setText(e.target.value);
        getText && getText(e.target.value);
    }

    useImperativeHandle(ref, () => ({
        currValue: text,
        setTextComingFromParent: (txt) => {
            setText(txt);
            setCurrentTextLength(txt.length);
        }
    }), [text])

    

    return (
        <div className='textarea-main'  >
            <textarea
                maxLength={maxLength}
                minLength={minLength}
                placeholder={placeholder}
                autoCorrect='off'
                autoComplete='off'
                autoCapitalize='off'
                onChange={handleChange}
                style={style}
                value={text}
            >
            </textarea>
            <div className='textarea-footer'>
                <div className='warning'>
                    {warning}
                </div>
                <div className='textarea-label'>
                    {currentTextLength} / {maxLength} max
                </div>
            </div>
        </div>
    )
})
