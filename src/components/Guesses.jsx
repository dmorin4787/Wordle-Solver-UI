import React from "react"

export default function Guesses(props) {

    /* Map result letter to the color to be rendered on screen */
    const colorMap = new Map()
    colorMap.set("g", "green")
    colorMap.set("y", "gold")
    colorMap.set("b", "grey")

    /* Generate the HTML to display previous guesses by mapping over each previous guess*/
    const guessElements = props.guesses.map(guess => (<div key={guess.word} className="Guesses">
                                                        <div className="Guesses-letter" style={{backgroundColor: `${colorMap.get(guess.colors.charAt(0))}`}}>
                                                            {guess.word.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="Guesses-letter" style={{backgroundColor: `${colorMap.get(guess.colors.charAt(1))}`}}>
                                                            {guess.word.charAt(1).toUpperCase()}
                                                        </div>
                                                        <div className="Guesses-letter" style={{backgroundColor: `${colorMap.get(guess.colors.charAt(2))}`}}>
                                                            {guess.word.charAt(2).toUpperCase()}
                                                        </div>
                                                        <div className="Guesses-letter" style={{backgroundColor: `${colorMap.get(guess.colors.charAt(3))}`}}>
                                                            {guess.word.charAt(3).toUpperCase()}
                                                        </div>
                                                        <div className="Guesses-letter" style={{backgroundColor: `${colorMap.get(guess.colors.charAt(4))}`}}>
                                                            {guess.word.charAt(4).toUpperCase()}
                                                        </div>
                                                    </div>))
    return (
        <div >
            {guessElements}
        </div>
    )
}