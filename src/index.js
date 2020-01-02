import React, { useState, useEffect } from 'react';
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
  const [squares, setSquares] = useState(Array(9).fill(null)); 
  const [xIsNext, setXIsNext] = useState(true);               
  const [gameStatus, setGameStatus] = useState('Next Player: X')           

  // history tracking
  const [stepNumber, setStepNumber] = useState(0);            
  const [history, setHistory] = useState([squares]);          
  const [currentSquares, setCurrentSquares] = useState(history[stepNumber]);

  // jump to int #step
  const jumpTo = (step) => {
    setStepNumber(step);
    setSquares(history[step]);
  }

  useEffect(() => {
    setXIsNext((stepNumber%2) === 0);
    const winner = calculateWinner(squares);
    if (winner){
      setGameStatus('Winner: ' + winner)
    }
    else{
      if (stepNumber === 9){
        setGameStatus("Draw");
      }
      else{
        setGameStatus('Next Player: ' + (xIsNext? 'X' : 'O'));
      }
    }
  }, [stepNumber, squares, xIsNext])


  // maps step # and move data from history to ordered list buttons
  const moves = history.map((step, move) => {
    const desc = move ? 
      'Move #: ' + move : 'Game start';
    return (
      <li key={move}>
        <button onClick = {() => jumpTo(move)}>{desc}</button>;
      </li>
    ); 
  });



  // each square re-rendered on click
  const renderSquare = (i) => {
    return (
      <Square 
        value={squares[i]}  
        // main driver of state change
        onClick={() => {
          setSquares(currentSquares);
          if (calculateWinner(squares) || squares[i]){
            return
          }

          const newSquares = squares.slice();
          newSquares[i] = xIsNext ? 'X' : 'O'; 

          setSquares(newSquares);
          setXIsNext(xIsNext? false : true);

          const newStepNumber = stepNumber+1;
          setStepNumber(newStepNumber);

          // writing and rewriting history
          let newHistory;
          if (newStepNumber < history.length){
            newHistory = history.slice(0,newStepNumber).concat([newSquares]);
          }
          else{
            newHistory = history.concat([newSquares]);
          }
          
          setHistory(newHistory);
          setCurrentSquares(newHistory[newStepNumber]);
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
  