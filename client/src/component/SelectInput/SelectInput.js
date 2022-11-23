import React, { useState, useEffect } from 'react'
import './selectInput.css'

export const SelectInput = ({ data, defaultOption, setOption, isSubOption, mainOption, defaultMainOption, value, style, indexValueToUpdate }) => {

    const handleChange = (e) => {
        if (indexValueToUpdate !== undefined) {
            setOption((prev) => {
                console.log(prev);
                const newOptions = [...prev]
                newOptions[indexValueToUpdate] = e.target.value
                return newOptions
            })
        } else {
            console.log("dsfadaf");
            setOption(e.target.value)
        }
    }

    
    return (
        <div className='select-input-main'>
            <select style={style} value={value} onChange={handleChange}>
                <option value={defaultOption}>{defaultOption}</option>
                {
                    (!mainOption || mainOption === defaultMainOption) && isSubOption ?
                        null
                        :
                        isSubOption ?
                            data[mainOption].map((item, index) => {
                                return (
                                    <option key={index} value={item}>{item}</option>
                                )
                            })
                            :
                            data.map((item, index) => {
                                return (
                                    <option key={index} value={item}>{item}</option>
                                )
                            })
                }
            </select>
        </div>
    )
}
