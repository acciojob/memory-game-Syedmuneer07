import React, { useState } from "react";

const LEVELS = {
  easy: { tiles: 8, pairs: 4, cols: 4 },
  normal: { tiles: 16, pairs: 8, cols: 4 },
  hard: { tiles: 32, pairs: 16, cols: 8 }
};

export default function App() {
  const [level, setLevel] = useState("easy");
  const [started, setStarted] = useState(false);
  const [cells, setCells] = useState([]);
  const [first, setFirst] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [matched, setMatched] = useState(0);
  const [lock, setLock] = useState(false);

  const startGame = () => {
    const nums = [];
    for (let i = 1; i <= LEVELS[level].pairs; i++) {
      nums.push(i, i);
    }

    shuffle(nums);

    setCells(
      nums.map((v, i) => ({
        id: i,
        value: v,
        revealed: false,
        matched: false
      }))
    );

    setAttempts(0);
    setMatched(0);
    setFirst(null);
    setLock(false);
    setStarted(true);
  };

  const onTileClick = (index) => {
    if (lock) return;

    const copy = [...cells];
    const cell = copy[index];

    if (cell.revealed || cell.matched) return;

    cell.revealed = true;
    setCells(copy);

    if (first === null) {
      setFirst(index);
      return;
    }

    setAttempts(a => a + 1);
    setLock(true);

    if (copy[first].value === cell.value) {
      copy[first].matched = true;
      cell.matched = true;
      setMatched(m => m + 1);
      setCells(copy);
      resetTurn();
    } else {
      setTimeout(() => {
        copy[first].revealed = false;
        cell.revealed = false;
        setCells(copy);
        resetTurn();
      }, 600);
    }
  };

  const resetTurn = () => {
    setFirst(null);
    setLock(false);
  };

  return (
    <div>
      {!started && <h1>Welcome!</h1>}

      {started && (
        <h4>
          {level === "easy" && "Easy Mode"}
          {level === "normal" && "Normal Mode"}
          {level === "hard" && "Hard Mode"}
        </h4>
      )}

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

      {started && (
        <div
          className="cells_container"
          style={{
            display: "grid",
            gap: "10px",
            justifyContent: "center",
            gridTemplateColumns: `repeat(${LEVELS[level].cols}, 60px)`
          }}
        >
          {cells.map((c, i) => (
            <div
              key={c.id}
              className="cell"
              onClick={() => onTileClick(i)}
              style={{
                width: "60px",
                height: "60px",
                background: c.matched
                  ? "#3498db"
                  : c.revealed
                  ? "#2ecc71"
                  : "#444",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              {c.revealed || c.matched ? c.value : ""}
            </div>
          ))}
        </div>
      )}

      {started && <p id="attempts">Attempts: {attempts}</p>}

      {matched === LEVELS[level].pairs && started && (
        <h2>All Solved</h2>
      )}
    </div>
  );
}

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
}
