import React, { useState } from "react";
import "./App.css";

const LEVELS = {
  easy: { pairs: 4, cols: 4 },
  normal: { pairs: 8, cols: 4 },
  hard: { pairs: 16, cols: 8 }
};

function App() {
  const [level, setLevel] = useState("easy");
  const [cells, setCells] = useState([]);
  const [first, setFirst] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [matched, setMatched] = useState(0);
  const [lock, setLock] = useState(false);

  const startGame = () => {
    const { pairs } = LEVELS[level];
    let nums = [];

    for (let i = 1; i <= pairs; i++) {
      nums.push(i, i);
    }

    nums = shuffle(nums);

    setCells(
      nums.map((n, i) => ({
        id: i,
        value: n,
        revealed: false,
        matched: false
      }))
    );

    setAttempts(0);
    setMatched(0);
    setFirst(null);
    setLock(false);
  };

  const handleClick = (i) => {
    if (lock) return;

    const copy = [...cells];
    const cell = copy[i];

    if (cell.revealed || cell.matched) return;

    cell.revealed = true;
    setCells(copy);

    if (first === null) {
      setFirst(i);
      return;
    }

    setAttempts(a => a + 1);
    setLock(true);

    if (copy[first].value === cell.value) {
      copy[first].matched = true;
      cell.matched = true;
      setMatched(m => m + 1);
      setCells(copy);
      reset();
    } else {
      setTimeout(() => {
        copy[first].revealed = false;
        cell.revealed = false;
        setCells(copy);
        reset();
      }, 600);
    }
  };

  const reset = () => {
    setFirst(null);
    setLock(false);
  };

  return (
    <div>
      <h1>Memory Game</h1>

      {/* LEVELS */}
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

      {/* GRID */}
      <div
        className="cells_container"
        style={{ gridTemplateColumns: `repeat(${LEVELS[level].cols}, 1fr)` }}
      >
        {cells.map((c, i) => (
          <div
            key={c.id}
            className={`cell ${c.revealed ? "revealed" : ""} ${
              c.matched ? "matched" : ""
            }`}
            onClick={() => handleClick(i)}
          >
            {c.revealed || c.matched ? c.value : ""}
          </div>
        ))}
      </div>

      <p id="attempts">Attempts: {attempts}</p>

      {matched === LEVELS[level].pairs && cells.length > 0 && (
        <h2>All Solved</h2>
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
