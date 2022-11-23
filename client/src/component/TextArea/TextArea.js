import { fontSize } from '@mui/system';
import React, { useState, useEffect } from 'react'
import './textArea.css'

export const TextArea = ({ maxLength, minLength, style, placeholder, defaultText, warning }) => {

    const [currentTextLength, setCurrentTextLength] = useState(minLength);

    return (
        <div className='textarea-main'  >
            <textarea
                maxLength={maxLength}
                minLength={minLength}
                placeholder={placeholder}
                autoCorrect='off'
                autoComplete='off'
                autoCapitalize='off'
                defaultValue={defaultText}
                onChange={(e) => setCurrentTextLength(e.target.value.length)}
                style={style}
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
}
