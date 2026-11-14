"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Mark = "X" | "O";
type Square = Mark | null;

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function getWinner(board: Square[]) {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { mark: board[a] as Mark, line };
    }
  }
  return null;
}

function getPlayerName(mark: Mark) {
  return mark === "X" ? "Spark" : "Orbit";
}

function MarkIcon({ mark, small = false }: { mark: Mark; small?: boolean }) {
  return mark === "X" ? (
    <svg className={`mark mark-x${small ? " mark-small" : ""}`} viewBox="0 0 64 64" aria-hidden="true">
      <path className="spark-trail" d="m8 13 7 3m-10 8 5 1" />
      <path className="spark-glyph" d="m32 5 6.5 20.5L59 32l-20.5 6.5L32 59l-6.5-20.5L5 32l20.5-6.5L32 5Z" />
    </svg>
  ) : (
    <svg className={`mark mark-o${small ? " mark-small" : ""}`} viewBox="0 0 64 64" aria-hidden="true">
      <ellipse className="planet-ring" cx="32" cy="32" rx="27" ry="11" transform="rotate(-28 32 32)" />
      <circle className="planet-core" cx="32" cy="32" r="12" />
      <path className="planet-ring-front" d="M8 40Q31 56 55 19" />
    </svg>
  );
}

export default function Home() {
  const [board, setBoard] = useState<Square[]>(Array(9).fill(null));
  const [current, setCurrent] = useState<Mark>("X");
  const [startingMark, setStartingMark] = useState<Mark>("X");
  const [scores, setScores] = useState<Record<Mark | "draws", number>>({ X: 0, O: 0, draws: 0 });
  const [round, setRound] = useState(1);
  const playAgainRef = useRef<HTMLButtonElement>(null);
  const winner = getWinner(board);
  const isDraw = !winner && board.every(Boolean);
  const isFinished = Boolean(winner || isDraw);

  useEffect(() => {
    if (isFinished) playAgainRef.current?.focus();
  }, [isFinished]);

  const newGame = useCallback(() => {
    setBoard(Array(9).fill(null));
    setRound((value) => value + 1);
    const nextStarter = startingMark === "X" ? "O" : "X";
    setStartingMark(nextStarter);
    setCurrent(nextStarter);
  }, [startingMark]);

  const resetMatch = useCallback(() => {
    setBoard(Array(9).fill(null));
    setCurrent("X");
    setStartingMark("X");
    setScores({ X: 0, O: 0, draws: 0 });
    setRound(1);
  }, []);

  const play = useCallback((index: number) => {
    if (board[index] || isFinished) return;
    const nextBoard = [...board];
    nextBoard[index] = current;
    setBoard(nextBoard);
    const result = getWinner(nextBoard);
    if (result) {
      setScores((previous) => ({ ...previous, [result.mark]: previous[result.mark] + 1 }));
    } else if (nextBoard.every(Boolean)) {
      setScores((previous) => ({ ...previous, draws: previous.draws + 1 }));
    }
    setCurrent((value) => (value === "X" ? "O" : "X"));
  }, [board, current, isFinished]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") newGame();
      if (/^[1-9]$/.test(event.key)) play(Number(event.key) - 1);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [newGame, play]);

  let status = `Player ${current === "X" ? "one" : "two"} (${getPlayerName(current)})'s turn`;
  if (winner) status = `Player ${winner.mark === "X" ? "one" : "two"} (${getPlayerName(winner.mark)}) wins this round!`;
  else if (isDraw) status = "A perfect match. It's a draw!";

  return (
    <main className="page-shell">
      <div className="ambient ambient-one" aria-hidden="true" />
      <div className="ambient ambient-two" aria-hidden="true" />
      <div className="game-wrap">
        <header className="topbar">
          <a className="brand" href="#top" aria-label="Grid Club home">
            <span className="brand-mark"><MarkIcon mark="X" small /><MarkIcon mark="O" small /></span>
            <span>GRID<span className="brand-light"> CLUB</span></span>
          </a>
          <div className="top-note"><span className="live-dot" /> LOCAL MULTIPLAYER <span className="note-divider">/</span> 01-02 PLAYERS</div>
        </header>

        <section className="intro" id="top">
          <div className="eyebrow"><span>THE CLASSIC, REPLAYED</span><span className="eyebrow-line" /></div>
          <h1>One more<br /><span>round?</span></h1>
          <p className="intro-copy">A little friendly competition never hurt.<br className="desktop-break" /> Pass the screen and make your move.</p>
        </section>

        <section className="game-card" aria-label="Tic Tac Toe game">
          <div className="game-topline">
            <span className="round-label">ROUND <strong>{String(round).padStart(2, "0")}</strong></span>
            <span className="best-of">BEST FRIENDS. WORST LOSERS.</span>
            <button className="reset-link" onClick={resetMatch} type="button" aria-label="Reset scores and start a new match">RESET MATCH <span>?</span></button>
          </div>

          <div className="score-row" aria-label="Scoreboard">
            <div className={`player-card player-x${!isFinished && current === "X" ? " is-turn" : ""}${winner?.mark === "X" ? " is-winner" : ""}`}>
              <div className="player-identity"><div className="player-icon"><MarkIcon mark="X" small /></div><div><span className="player-caption">PLAYER ONE</span><span className="player-name">Spark</span></div></div>
              <span className="score" aria-label={`Player one score ${scores.X}`}>{scores.X}</span>
              {!isFinished && current === "X" && <span className="turn-indicator">UP NEXT</span>}
              {winner?.mark === "X" && <span className="turn-indicator win-indicator">WINNER</span>}
              {winner?.mark === "O" && <span className="turn-indicator loss-indicator">ROUND LOST</span>}
            </div>

            <div className="versus" aria-label="versus">VS</div>

            <div className={`player-card player-o${!isFinished && current === "O" ? " is-turn" : ""}${winner?.mark === "O" ? " is-winner" : ""}`}>
              <div className="player-identity"><div className="player-icon"><MarkIcon mark="O" small /></div><div><span className="player-caption">PLAYER TWO</span><span className="player-name">Orbit</span></div></div>
              <span className="score" aria-label={`Player two score ${scores.O}`}>{scores.O}</span>
              {!isFinished && current === "O" && <span className="turn-indicator">UP NEXT</span>}
              {winner?.mark === "O" && <span className="turn-indicator win-indicator">WINNER</span>}
              {winner?.mark === "X" && <span className="turn-indicator loss-indicator">ROUND LOST</span>}
            </div>
          </div>

          <div className="board-area">
            <div className="board-heading"><span className="status-dot" /> <span aria-live="polite" aria-atomic="true">{status}</span></div>
            <div className={`board${isFinished ? " is-finished" : ""}`} role="grid" aria-label="Tic Tac Toe board">
              {board.map((mark, index) => {
                const isWinningSquare = winner?.line.includes(index) ?? false;
                return (
                  <button
                    className={`square${mark ? ` has-${mark.toLowerCase()}` : ""}${isWinningSquare ? " winning-square" : ""}`}
                    key={index}
                    type="button"
                    role="gridcell"
                    aria-label={`Square ${index + 1}${mark ? `, ${getPlayerName(mark)}` : ", empty"}${isWinningSquare ? ", part of winning line" : ""}`}
                    aria-disabled={Boolean(mark || isFinished)}
                    onClick={() => play(index)}
                  >
                    {mark ? <MarkIcon mark={mark} /> : <span className="square-number">0{index + 1}</span>}
                  </button>
                );
              })}
            </div>
            <div className="board-footer"><span>THINK AHEAD. STAY SHARP.</span><span>DRAWN TOGETHER <span className="tiny-heart"></span></span></div>
          </div>

          <div className={`result-bar${isFinished ? " result-visible" : ""}`} aria-live="polite">
            <span>{isDraw ? "NOBODY WINS. THE RIVALRY CONTINUES." : winner ? `PLAYER ${winner.mark === "X" ? "ONE" : "TWO"} TAKES THE ROUND.` : ""}</span>
            <span className="draw-score">DRAWS <strong>{scores.draws}</strong></span>
          </div>
        </section>

        <div className="action-row">
          <button className="new-game-button" onClick={newGame} type="button"><span>New game</span><span className="button-arrow">?</span></button>
          <div className="keyboard-hint"><span className="keycap">1-9</span> TO PLAY <span className="hint-gap" /><span className="keycap">ESC</span> NEW ROUND</div>
        </div>

        <footer className="footer"><span>DESIGNED FOR THE LOVE OF THE GAME</span><span>TAKE TURNS. TALK TRASH. REPEAT.</span></footer>
      </div>

      {isFinished && (
        <div className="result-overlay" role="presentation">
          <section className={`result-dialog${isDraw ? " draw-dialog" : " win-dialog"}`} role="dialog" aria-modal="true" aria-labelledby="result-title" aria-describedby="result-description">
            <span className="dialog-spark dialog-spark-one" aria-hidden="true">?</span>
            <span className="dialog-spark dialog-spark-two" aria-hidden="true">?</span>
            <div className="dialog-icons">
              <span className={`dialog-icon${winner?.mark === "X" ? " dialog-icon-winner" : ""}`}><MarkIcon mark="X" /></span>
              <span className="dialog-vs">{isDraw ? "TIE" : "VS"}</span>
              <span className={`dialog-icon${winner?.mark === "O" ? " dialog-icon-winner" : ""}`}><MarkIcon mark="O" /></span>
            </div>
            <p className="dialog-kicker">{isDraw ? "EVENLY MATCHED" : "ROUND COMPLETE"}</p>
            <h2 id="result-title">{isDraw ? "A perfect tie." : `Player ${winner?.mark === "X" ? "1" : "2"} wins!`}</h2>
            <p id="result-description" className="dialog-copy">
              {isDraw ? "Nobody takes this one. Ready for a rematch?" : `Player ${winner?.mark === "X" ? "2" : "1"} loses this round. Time to settle it again?`}
            </p>
            <button ref={playAgainRef} className="play-again-button" onClick={newGame} type="button"><span>Play again</span><span aria-hidden="true">?</span></button>
            <span className="dialog-round">ROUND {String(round).padStart(2, "0")} COMPLETE</span>
          </section>
        </div>
      )}
    </main>
  );
}

