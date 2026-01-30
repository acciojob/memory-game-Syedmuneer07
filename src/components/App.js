import React, { useState } from "react";
import "./App.css";

const LEVELS = {
  easy: 4,
  normal: 8,
  hard: 16
};

function App() {
  const [level, setLevel] = useState(null);
  const [cells, setCells] = useState([]);
  const [first, setFirst] = useState(null);
  const [second, setSecond] = useState(null);
  const [lock, setLock] = useState(false);
  const [matchedPairs, setMatchedPairs] = useState(0);

  const startGame = () => {
    const pairs = LEVELS[level];
    let numbers = [];

    for (let i = 1; i <= pairs; i++) {
      numbers.push(i, i);
    }

    numbers = numbers.sort(() => Math.random() - 0.5);

    setCells(
      numbers.map((num, idx) => ({
        id: idx,
        value: num,
        open: false,
        matched: false
      }))
    );

    setFirst(null);
    setSecond(null);
    setMatchedPairs(0);
    setLock(false);
  };

  const handleClick = (cell) => {
    if (lock || cell.open || cell.matched) return;

    const updated = cells.map(c =>
      c.id === cell.id ? { ...c, open: true } : c
    );
    setCells(updated);

    if (!first) {
      setFirst(cell);
      return;
    }

    setSecond(cell);
    checkMatch(cell);
  };

  const checkMatch = (secondCell) => {
    setLock(true);

    if (first.value === secondCell.value) {
      setCells(prev =>
        prev.map(c =>
          c.value === first.value ? { ...c, matched: true } : c
        )
      );
      setMatchedPairs(p => p + 1);
      resetTurn();
    } else {
      setTimeout(() => {
        setCells(prev =>
          prev.map(c =>
            c.matched ? c : { ...c, open: false }
          )
        );
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
    <div>
      {/* LANDING / LEVEL SELECTION */}
      <div className="levels_container">
        <label>
          <input
            type="radio"
            id="easy"
            name="level"
            onChange={() => setLevel("easy")}
          />
          Easy
        </label>

        <label>
          <input
            type="radio"
            id="normal"
            name="level"
            onChange={() => setLevel("normal")}
          />
          Medium
        </label>

        <label>
          <input
            type="radio"
            id="hard"
            name="level"
            onChange={() => setLevel("hard")}
          />
          Hard
        </label>

        <button onClick={startGame}>Start</button>
      </div>

      {/* GAME GRID */}
      <div
        className="cells_container"
        style={{
          gridTemplateColumns: `repeat(${Math.sqrt(cells.length)}, 1fr)`
        }}
      >
        {cells.map(cell => (
          <div
            key={cell.id}
            className={`cell ${cell.open ? "open" : ""} ${cell.matched ? "matched" : ""}`}
            onClick={() => handleClick(cell)}
          >
            {cell.open || cell.matched ? cell.value : ""}
          </div>
        ))}
      </div>

      {/* ALL SOLVED STATE */}
      {matchedPairs > 0 && matchedPairs === LEVELS[level] && (
        <h3>All Solved</h3>
      )}
    </div>
  );
}

export default App;
