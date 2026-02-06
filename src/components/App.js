import React, { useState } from "react";
import "./App.css";

const LEVELS = {
  easy: { tiles: 8, pairs: 4, cols: 4 },
  normal: { tiles: 16, pairs: 8, cols: 4 },
  hard: { tiles: 32, pairs: 16, cols: 8 }
};

function App() {
  const [level, setLevel] = useState("easy");
  const [cells, setCells] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [matched, setMatched] = useState(0);
  const [lock, setLock] = useState(false);

  const startGame = () => {
    const { pairs } = LEVELS[level];
    let numbers = [];

    for (let i = 1; i <= pairs; i++) {
      numbers.push(i, i);
    }

    numbers = shuffle(numbers);

    setCells(
      numbers.map((num, idx) => ({
        id: idx,
        value: num,
        revealed: false,
        matched: false
      }))
    );

    setFirst(null);
    setSecond(null);
    setAttempts(0);
    setMatched(0);
    setLock(false);
  };

  const handleClick = (index) => {
    if (lock) return;

    const newCells = [...cells];
    const cell = newCells[index];

    if (cell.revealed || cell.matched) return;

    cell.revealed = true;
    setCells(newCells);

    if (!first) {
      setFirst(index);
      return;
    }

    setSecond(index);
    setAttempts((a) => a + 1);
    setLock(true);

    if (newCells[first].value === cell.value) {
      newCells[first].matched = true;
      cell.matched = true;
      setCells(newCells);
      setMatched((m) => m + 1);
      resetTurn();
    } else {
      setTimeout(() => {
        newCells[first].revealed = false;
        cell.revealed = false;
        setCells(newCells);
        resetTurn();
      }, 700);
    }
  };

  const resetTurn = () => {
    setFirst(null);
    setSecond(null);
    setLock(false);
  };

  return (
    <div className="app">
      <h1>Memory Game</h1>

      {/* LEVEL SELECTION */}
      <div className="levels_container">
        <label>
          <input
            type="radio"
            id="easy"
            name="level"
            checked={level === "easy"}
            onChange={() => setLevel("easy")}
          />
          Easy
        </label>

        <label>
          <input
            type="radio"
            id="normal"
            name="level"
            checked={level === "normal"}
            onChange={() => setLevel("normal")}
          />
          Normal
        </label>

        <label>
          <input
            type="radio"
            id="hard"
            name="level"
            checked={level === "hard"}
            onChange={() => setLevel("hard")}
          />
          Hard
        </label>

        <button onClick={startGame}>Start Game</button>
      </div>

      {/* GAME GRID */}
      <div
        className="cells_container"
        style={{
          gridTemplateColumns: `repeat(${LEVELS[level].cols}, 1fr)`
        }}
      >
        {cells.map((cell, index) => (
          <div
            key={cell.id}
            className={`cell ${
              cell.revealed ? "revealed" : ""
            } ${cell.matched ? "matched" : ""}`}
            onClick={() => handleClick(index)}
          >
            {cell.revealed || cell.matched ? cell.value : ""}
          </div>
        ))}
      </div>

      <p id="attempts">Attempts: {attempts}</p>

      {matched === LEVELS[level].pairs && cells.length > 0 && (
        <h2>🎉 All Solved!</h2>
      )}
    </div>
  );
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default App;
