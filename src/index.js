import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Functional Component structure:
//        Game: winner tracking, history, current player tracking, handling square clicks,
//          |  
//        Square: stores value and onClick function passed in from Game


// stateless square component
function Square({value, onClick}) {
  return (
      <button 
          className="square" 
          onClick={onClick}
      >   
        {value}
      </button>
  );
}

// main driver
function Game (){
  // Game state hooks
  const [squares, setSquares] = useState(Array(9).fill(null)); // init as empty
  const [xIsNext, setXIsNext] = useState(true);               // bool switched on each render
  const [gameStatus, setGameStatus] = useState('Next Player: X')           // recalculated on every render

  // history tracking
  const [stepNumber, setStepNumber] = useState(0);            // stepNumber incremented on each render
  const [history, setHistory] = useState([squares]);          // array of arrays
  const [currentSquares, setCurrentSquares] = useState(history[stepNumber]);

  // jump to int #step
  const jumpTo = (step) => {
    setStepNumber(step);
    // x is Next on even turns
    setXIsNext((step % 2) === 0);
  }

  const moves = history.map((step, move) => {
    const desc = move ? 
      'Move #: ' + move : 'Game start';
    // jump to (re-render) each move on click, each move stored in ordered list
    return (
      <li key={move}>
        <button onClick = {() => jumpTo(move)}>{desc}</button>;
      </li>
    ); 
  });

  // also updates square state info
  const renderSquare = (i) => {
    return (
      <Square 
        value={squares[i]}  
        // driver of state change
        onClick={() => {
          // update if moved back in history
          setSquares(currentSquares);
          if (calculateWinner(squares) || squares[i]){
            console.log('already placed');
            return
          }
          const newSquares = squares.slice();
          newSquares[i] = xIsNext ? 'X' : 'O'; 
          setSquares(newSquares);
          setXIsNext(xIsNext? false : true);

          setStepNumber(stepNumber+1);
          console.log(stepNumber);
          setHistory(history.concat([newSquares]));
          console.log(history);
          setCurrentSquares(history[stepNumber]);
          console.log(currentSquares);

          const winner = calculateWinner(newSquares);
          if (winner){
            setGameStatus('Winner: ' + winner)
          }
          
          else{
            if (stepNumber === 10){
              setGameStatus("Draw");
            }
            setGameStatus('Next Player: ' + (xIsNext? 'O' : 'X'));
          }
        }}
      />
    );
  }

  // master render
  return (
    <div className="game">
      <div className="game-board"> 
        <div>
          <div className="board-row">
            {renderSquare(0)}
            {renderSquare(1)}
            {renderSquare(2)}
          </div>
          <div className="board-row">
            {renderSquare(3)}
            {renderSquare(4)}
            {renderSquare(5)}
          </div>
          <div className="board-row">
            {renderSquare(6)}
            {renderSquare(7)}
            {renderSquare(8)}
          </div>
        </div>
      </div>
      <div className="game-info">
        <div>{gameStatus}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


// given all combinations of wins, 
// checks values in squares against these combinations
// to determine a winner, if any
function calculateWinner(squares){
  const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++){
    const [a, b, c] = lines[i];
    // if squares[a] exists and any winning combination is found 
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
        return squares[a];
    }
  }
  return null;
}
  
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
  