import React from "react"

export default function Box(props) {
    const color_style = {
        backgroundColor: props.color
    }

    return (
        <div
            style={color_style}
            className ="Guesses-letter"
            onClick={props.toggle}
        >
            {props.letter}     
        </div>
    )
}