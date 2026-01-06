import { useState } from "react";

function Square({value, onSquareClick}) {
  return (<button className="square" onClick={onSquareClick}>{value}</button>);
}

function Board({xIsNext, squares, onPlay}) {
  function handleClick(i) {
    // If the square is already filled (not null), don't change it and stop the function.
    // If there is a winner (not null), stop the game early.
    if (squares[i] || calculateWinner(squares)) {
      return;
    }

    // Creates a copy of the array
    const nextSquares = squares.slice();

    // Sets it to O if it is set to X and vise versa
    // Simulates "players"
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;

  if (winner) {
    status = "Winner: " + winner;
  // If squares doensn't include null, it's a draw.
  } else if (!squares.includes(null)) {
    status = "Draw";
  } else {
    // If xIsNext is true (even), X goes next, otherwise O does (false).
    // Terminal operators, not 
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>

      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>

      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} /> 
      </div>
    </>
  );
}

export default function Game() {
  // Creates an array with 9 values of null
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  // If the move is even, xIsNext is true, otherwise, O is next.
  const xIsNext = currentMove % 2 === 0;

  // Current move, NOT the last move because user might have jumped around.
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move)=>  {
    let description;
    if (move > 0) {
      description = "Go to move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    )
  
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    // Across
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    
    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    
    // Diagonal
    [0, 4, 8],
    [2, 4, 6],
  ];

  // Check every possibility for winning
  for (let i = 0; i < lines.length; i++) {

    // Set a b and c to winning INDEXES (thanks Claude) so they can be compared
    const [a, b, c] = lines[i];

    // If the first square isn't null AND
    // If the first and second square are the same AND
    // If the second and third square the same, then you have a winner
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }

  return null;
}
