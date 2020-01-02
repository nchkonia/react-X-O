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
    // note: same issue as with renderSquare.onClick: only updates on second render
    // x is Next on even turns
    console.log(`step: ${step}`);
    // setXIsNext((step % 2) === 0);
    console.log(`is x next when jumped? ${xIsNext}`)
    setSquares(history[step]);
    // setCurrentSquares(squares);
  }

  useEffect(() => {
    setXIsNext((stepNumber%2) === 0);
    console.log(`in effect hook, is X next? ${xIsNext}`);
    setGameStatus('Next Player: ' + (xIsNext? 'X' : 'O'));
    
    // setHistory(history.slice(0,stepNumber));
  })

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
          // update squares when stepped back in history
          setSquares(currentSquares);
          console.log(`current squares: ${currentSquares}`)
          if (calculateWinner(squares) || squares[i]){
            console.log('already placed');
            return
          }

          // WOW, seems to be CHANGING THE PREVIOUS MOVE TO THE CURRENT PLAYER'S VALUE
          const newSquares = squares.slice();
          console.log(newSquares[i]);
          newSquares[i] = xIsNext ? 'X' : 'O'; 
          console.log(newSquares[i]);

          setSquares(newSquares);
          setXIsNext(xIsNext? false : true);
          console.log(`new squares: ${newSquares}`);
          console.log(`squares: ${squares}`);
          console.log(`is x next? ${xIsNext}`);
          console.log('\n');

          const newStepNumber = stepNumber+1;
          setStepNumber(newStepNumber);
          console.log(`stepNumber: ${stepNumber}`);
          console.log(`newStepNumber: ${newStepNumber}`);
          console.log('\n');


          // this ONLY adds to history,
          // const newHistory = history.concat([newSquares]);
          // const newHistory = (history.slice(0, stepNumber)).concat([newSquares]);
          let newHistory;
          // bandaid solution to rewriting history
          if (newStepNumber < history.length){
            newHistory = history.slice(0,newStepNumber).concat([newSquares]);
          }
          else{
            newHistory = history.concat([newSquares]);
          }
          
          // const newHistory = history.slice(0, newStepNumber+1);

          setHistory(newHistory);

          console.log('history');
          console.log(history)
          console.log('newHistory');
          console.log(newHistory);
          console.log('\n');

          
          setCurrentSquares(newHistory[newStepNumber]);
          console.log(`currentSquares: ${currentSquares}`);

          const winner = calculateWinner(newSquares);
          if (winner){
            setGameStatus('Winner: ' + winner)
          }
          
          else{
            if (newStepNumber === 9){
              setGameStatus("Draw");
            }
            else{
              setGameStatus('Next Player: ' + (xIsNext? 'O' : 'X'));
            }
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
  console.log(`squares: ${squares}`);
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
        console.log('WINNER')
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
  