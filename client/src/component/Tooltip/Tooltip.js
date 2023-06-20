import React from 'react'
// import "react-tooltip/dist/react-tooltip.css";
import { Tooltip as ReactTooltip } from "react-tooltip";
import './Tooltip.css'
import { colors, dark_grey_color } from '../../utility/color.js'

export const Tooltip = ({ id, place, content, variant }) => {

    // console.log(place);

    return (
        <ReactTooltip
            style={{
                lineHeight: '1.5',
                maxWidth: '35ch',
                backgroundColor: variant ? colors.get(variant) : colors.get('dark_grey_color'),
                zIndex: '999'
            }}
            place={place}
            id='my-tooltip'

        />
    )
}
