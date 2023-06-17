import { useEffect, useRef, useState } from "react";
import "react-simple-keyboard/build/css/index.css";
import "./Worldly.css";
import Alert from "@mui/material/Alert";
var wordList = require("word-list-json");

const guessingWord = "frost";

const keyboardLayout = [
  "qwertyuiop".split(""),
  "asdfghjkl".split(""),
  ["Enter"].concat("zxcvbnm".split("")),
];

const wordMap = {};

for (let i = 0; i < guessingWord.length; i++) {
  if (wordMap[guessingWord[i]]) {
    wordMap[guessingWord[i]].push(i);
  } else {
    wordMap[guessingWord[i]] = [i];
  }
}

const initialGameBoard = new Array(6).fill().map(() =>
  new Array(5).fill().map(() => ({
    letter: "",
    processed: false,
    rightLetter: false,
    rightPosition: false,
  }))
);

const useEventHandler = (eventName, eventHandler, eventTarget = document) => {
  const eventHandlerRef = useRef();

  useEffect(() => {
    eventHandlerRef.current = eventHandler;
  });

  useEffect(() => {
    const handleEvent = (...args) => eventHandlerRef?.current(...args);

    eventTarget.addEventListener(eventName, handleEvent);

    return () => eventTarget.removeEventListener(eventName, handleEvent);
  }, []);
};

const Worldly = () => {
  const [boardState, setBoardState] = useState(initialGameBoard);
  const [currentRow, setCurrentRow] = useState(0);
  const [currentColumn, setCurrentColumn] = useState(-1);
  const lockKeyboardRef = useRef(null);
  const [keypadMap, setKeypadMap] = useState({});
  const [showToast, setShowToast] = useState(false);

  const processText = () => {
    lockKeyboardRef.current = true;
    if (currentColumn !== 4) {
      alert("Please enter five letters");
      lockKeyboardRef.current = false;
      return;
    }

    const newBoardState = [...boardState];
    let row = newBoardState[currentRow];

    const enteredWord = row.reduce((prev, current) => {
      return prev + current.letter;
    }, "");
    console.log(wordList.includes(enteredWord));

    if (!wordList.includes(enteredWord)) {
      setShowToast(true);
      lockKeyboardRef.current = false;
      setTimeout(() => {
        setShowToast(false);
      }, 2000);
      return;
    }
    let count = 0;
    const keyMap = { ...keypadMap };
    for (const [index, column] of row.entries()) {
      column.processed = true;
      let keyMapCode = 0;
      if (guessingWord.includes(column.letter)) {
        column.rightLetter = true;
        keyMapCode = 1;
        if (wordMap[column.letter].includes(index)) {
          column.rightPosition = true;
          keyMapCode = 2;
          count += 1;
        }
      } else {
        keyMapCode = -1;
      }
      keyMap[column.letter] = keyMapCode;
    }
    setBoardState(newBoardState);
    setTimeout(() => {
      setKeypadMap(keyMap);
      if (count === 5) {
        alert("You won");
        return;
      }
      setCurrentRow((currentRow) => currentRow + 1);
      setCurrentColumn(-1);
      lockKeyboardRef.current = false;
    }, 1250);
  };

  const processUserInput = (letter) => {
    setCurrentColumn((currentColumn) => {
      if (currentColumn < 4) {
        setBoardState((currentBoardState) => {
          const newBoard = [...currentBoardState];
          newBoard[currentRow][currentColumn + 1].letter = letter;
          return newBoard;
        });
        return currentColumn === 4 ? currentColumn : currentColumn + 1;
      } else {
        return currentColumn;
      }
    });
  };

  const processBackspace = () => {
    setCurrentColumn((currentColumn) => {
      if (currentColumn >= 0) {
        setBoardState((currentBoardState) => {
          const newBoard = [...currentBoardState];
          if (newBoard[currentRow][currentColumn].letter !== "") {
            newBoard[currentRow][currentColumn].letter = "";
          }
          return newBoard;
        });
        return currentColumn - 1;
      } else {
        return currentColumn;
      }
    });
  };

  useEventHandler("keydown", (event) => {
    if (!lockKeyboardRef.current) {
      if (event.key === "Enter") {
        processText();
        return;
      }
      if (event.key === "Backspace") {
        processBackspace();
        return;
      }
      const key = event.key.toLowerCase();
      if (key.length !== 1) {
        return;
      }
      const isLetter = key >= "a" && key <= "z";
      if (isLetter) {
        processUserInput(event.key);
      }
    }
  });

  const processKeypad = (letter) => {
    if (letter !== "Enter") {
      processUserInput(letter);
    } else {
      processText();
    }
  };

  return (
    <>
      <div
        className={`alert-container ${showToast ? "opacity-100" : "opacity-0"}`}
      >
        <Alert severity="error" color="error">
          Not a valid word, Try again!
        </Alert>
      </div>
      <div className="flex-container">
        <div className="game-container">
          <div className="answer-container">
            {currentRow > 5 && (
              <span>
                The Word was{" "}
                <strong>{"    " + guessingWord.toUpperCase()}</strong>
              </span>
            )}
          </div>
          {boardState.map((row, index) => (
            <div key={index} className="board-row">
              {row.map((column, index) => (
                <div
                  key={index}
                  className={`board-column background-transition-${index} ${
                    column.processed ? "processed" : ""
                  } ${column.rightLetter ? "right-letter" : ""} ${
                    column.rightPosition ? "right-position" : ""
                  }
                ${column.letter ? "highlight-column" : ""}`}
                >
                  {column.letter}
                </div>
              ))}
            </div>
          ))}
        </div>
        <div className="keyboard-container">
          {keyboardLayout.map((row, index) => (
            <div key={index} className="keyboard-row">
              {row.map((letter, index) => (
                <button
                  key={index}
                  onClick={() => processKeypad(letter)}
                  className={`keyboard-key ${
                    keypadMap[letter]
                      ? keypadMap[letter] === 2
                        ? "correct-position"
                        : keypadMap[letter] === 1
                        ? "correct-letter"
                        : "wrong"
                      : ""
                  }`}
                >
                  {letter}
                </button>
              ))}
              {index === 2 && (
                <button onClick={processBackspace} className="keyboard-key">
                  <i className="material-icons">backspace</i>
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export { Worldly };
