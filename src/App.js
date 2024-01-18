import React from 'react';
import './App.css';
import Guesses from './components/Guesses'
import Box from './components/Box'
import defaultGuesses from './defaultGuesses';
import axios from 'axios'


function App() {

  const numberAttempts = React.useRef(0)
  const sesID = React.useRef("")
  const [firstGuessNeeded, setFirstGuessNeeded] = React.useState(true)
  const [gameWon, setGameWon] = React.useState(false)
  const [gameLost, setGameLost] = React.useState(false)
  const [currGuess, setCurrGuess] = React.useState(defaultGuesses)
  const [prevGuesses, setPrevGuesses] = React.useState([])

  function handleEnter(event) {
    if (event.key === "Enter") {
      getFirstGuess()
    }
  }

  /* 
    Change the color of the individual letter for the current guess 
  */
  function toggle(id) {
      setCurrGuess(prevCurrGuess => 
          {return (prevCurrGuess.map((guess) => {
            if (guess.id === id) {
              let newColor;
              if (guess.color === "grey") {
                newColor = "gold"
              } else if (guess.color === "gold") {
                newColor = "green"
              } else {
                newColor = "grey"
              }
              return {...guess, color: newColor}
            } else {
              return guess
            }
          }))})
  }

  /* 
    Read the first guess from the user
  */
  function getFirstGuess() {
    const firstGuess = document.getElementById("firstGuess").value

    if (firstGuess.length === 5) {
      setCurrGuess(prevCurrGuess => 
        {
          return(prevCurrGuess.map((guess, index) => {
            const guessLetter = firstGuess.charAt(index).toUpperCase()
            return {...guess, letter: guessLetter}
          }))
        })
    } else {
      alert("First Guess Input Requires Exactly 5 Characters")
    }
  }

  /* 
    Query the API for the next best guess
  */
  async function getNextGuessAPI(guessWord, guessResult) {

    const queryParams = {
      guess: guessWord,
      result: guessResult,
      sessionId: sesID.current,
    }
  
    const url = "/wordlesolver/rest/getnextwordjson"
  
    try {
      const response = await axios.get(url, {
        params: queryParams,
        headers: {
          'Content-Type': 'application/json',
        },
      })
  
      const data = response.data
      sesID.current = data.sessionId

      return data.word 

    } catch (error) {
      console.error('An error occurred:', error)
    }
  }

  /* 
    Clean up the current session on the API
  */
  async function cleanUpSessionAPI() {

    const parameters = {sessionId: sesID.current}

    try {
      await axios.get("/wordlesolver/rest/cleanup", {params: parameters})
    } catch(error){
      console.error('An error occurred:', error)
    }
  }

  /* 
    Generate the next best guess and render to the screen
  */
  async function generateNextGuess() {
    let currentWord = ""
    let currentColor = ""

    for(const guess of currGuess) {
      currentWord += guess.letter
        
        
      if(guess.color === "grey") {
        currentColor += "b"
      } else if(guess.color === "gold") {
        currentColor += "y"
      } else {
        currentColor += "g"
      }
    }

    /* Check if no word has been submitted yet */

    if(currentWord === "") {
      alert("Make a guess before submitting!")
      return
    }

    setFirstGuessNeeded(false)
    numberAttempts.current += 1

    /*Check if game has been won */

    if(currentColor === "ggggg") {
      setGameWon(true)
      return
    }
 
    /* Ensure user does not exceed 6 guesses */
    if(numberAttempts.current <= 5) {

      /* 1. Call api to receive next guess */

      const nextGuess = await getNextGuessAPI(currentWord, currentColor)
  
      //Restart game to handle null word response
      if (nextGuess === null) {
        alert("Invalid Guess Input. Please Try Again")
        resetGuesses()
        return
      }

      const nextGuessWord = nextGuess.toUpperCase()

      /* 2. Add current guess to previous guess array (letters and colors) */

      setPrevGuesses((prevPrevGuesses) => [...prevPrevGuesses, {word: currentWord, colors: currentColor}])

      /* 3. Populate current guess with response from api*/ 

      setCurrGuess([{id: 1, color: "grey", letter: `${nextGuessWord.charAt(0)}`}, 
                    {id: 2, color: "grey", letter: `${nextGuessWord.charAt(1)}`}, 
                    {id: 3, color: "grey", letter: `${nextGuessWord.charAt(2)}`}, 
                    {id: 4, color: "grey", letter: `${nextGuessWord.charAt(3)}`}, 
                    {id: 5, color: "grey", letter: `${nextGuessWord.charAt(4)}`}])
    } else {
      /*Game has been lost due to guess limit being reached */
      setGameLost(true)
    }

  }

  /* 
    Reset the UI to the original state
  */
  function resetGuesses() {
    setCurrGuess(defaultGuesses)
    setPrevGuesses([])
    setGameWon(false)
    setGameLost(false)
    setFirstGuessNeeded(true)
    sesID.current = ""
    numberAttempts.current = 0
    cleanUpSessionAPI()
  }

  /* Generate HTML to render currGuess by mapping over each letter of the first guess */
  const guessElement = currGuess.map(box => {
    return (<Box  
                key={box.id}
                letter={box.letter}
                toggle={() => toggle(box.id)}
                color={box.color}
            />)
  })

  return (
    <div>
      <header className="title">
        <strong>Wordle Solver</strong>
      </header>
      <p className="instructions">
        Instructions: <br></br>
        Type in your first guess and we will generate the next
        best guess based on the result! <br></br>
        (Click the letter icon to change color)
      </p>

      {firstGuessNeeded && 
        <div className="firstGuessInput">
          First Guess: 
          <input type="text" id="firstGuess" className="inputText" onKeyDown={handleEnter} ></input>
          <button onClick={getFirstGuess} className="inputButton">Enter</button>
        </div>
      }
      

      {!firstGuessNeeded && <Guesses guesses={prevGuesses}/>}
      <div className="Guesses">
          {guessElement}
      </div>

      {gameWon && 
        <p className="winText">Congratulations you solved the wordle in {numberAttempts.current + " "}
        {numberAttempts.current === 1 ? "try" : "tries"}!
        </p>
      }

      {gameLost && 
        <p className="loseText">Sorry we could not help you today, better luck next time!</p>
      }

      <div className ="Buttons">
        {(!gameWon && !gameLost) && 
          <button onClick={generateNextGuess} className="submitButton">Submit</button>
        }
        <button onClick={resetGuesses} className="resetButton">Reset</button>
      </div>
      
    </div>
  );
}

export default App;
