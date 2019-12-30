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
  // also updates square state info
  const renderSquare = (i) => {
    return (
      <Square 
        value={squares[i]} 

        // driver of state change
        onClick={() => {
          if (calculateWinner(squares) || squares[i]){
            return
          }

          const newSquares = squares.slice();
          newSquares[i] = xIsNext ? 'X' : 'O'; 
          setSquares(newSquares);
          setXIsNext(xIsNext? false : true);

          // update history states
          setHistory(history.slice(0, stepNumber+1));
          setCurrentState(history[history.length-1]);
          setStepNumber(history.length);

          const winner = calculateWinner(newSquares);
          if (winner){
            setGameStatus('Winner: ' + winner)
          }
          else{
            setGameStatus('Next Player: ' + (xIsNext? 'O' : 'X'));
          }
        }}
      />
    );
}

  // Game state hooks
  const [squares, setSquares] = useState(Array(9).fill(null)); // init as empty
  const [xIsNext, setXIsNext] = useState(true);               // bool switched on each render
  const [stepNumber, setStepNumber] = useState(0);            // stepNumber incremented on each render

  // history tracking
  const [history, setHistory] = useState(squares);            // history is squares, updated each render
  const [currentState, setCurrentState] = useState(stepNumber);
  const [gameStatus, setGameStatus] = useState('Next Player: X')           // recalculated on every render
  // const [moves, setMoves] = useState();                       // renders moves in history


  const jumpTo = (step) => {
    setStepNumber(step);
    setStepNumber(step % 2 === 0); // x is next on even turns
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
        
        {/* <button 
            className="square"
            onClick={(i) => {
      
              }
            }
              // ;
          >
            {squares}
        </button> */}
      </div>
      <div className="game-info">
        <div>{gameStatus}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}


// game state (and there4 what to render) encapsulated in Game obj
// class GameClass extends React.Component {
//   // note: multiple useStates
//   // note:
//   // useState for:  
//   // - history
//   // - squares
//   // - xIsNext
//   // - stepNumber

//   constructor(props){
//     super(props);
//     this.state = {
//         history: [{
//             squares: Array(9).fill(null),
//         }],
//         xIsNext: true,
//         stepNumber: 0,
//     };
//   }
//   // updates gamestate after square is clicked
//   // game states are discretized via valid clicks 
//   handleClick(i){
//     // design decision: history is only up until this step: discards future history
//     //  if gone back to a certain move and made a move from there
//     // note: setHistory here
//     const gameHistory = this.state.history.slice(0, this.state.stepNumber + 1);
//     // note: setCurrentState here
//     const current_state = gameHistory[gameHistory.length-1];
//     // note: setSquares here
//     const squares = current_state.squares.slice();
//     // if winner or square already filled
//     if (calculateWinner(squares) || squares[i]){
//       return;
//     }
//     // update value in square
//     squares[i] = this.state.xIsNext ? 'X' : 'O';
//     // add updated state to history, next player's turn
//     // NOTE: concat merges arrays and makes a new array
//     // thus, the history obj gets updated (reassigned new arrays every time) 
//     this.setState({
//       history: gameHistory.concat([{
//         squares: squares,
//       }]),
//       // note: setXIsNext
//       xIsNext: !this.state.xIsNext,
//       // note: setStepNumber
//       stepNumber: gameHistory.length,
//     });
//   }
//   // jump to int #step
//   jumpTo(step){
//     this.setState({
//       stepNumber: step,
//       // x is Next on even turns
//       xIsNext: (step % 2) === 0,
//     })
//   }

//   // note: useEffect
//   render() {
//     const gameHistory = this.state.history; 
//     const currentState = gameHistory[this.state.stepNumber]; 
//     const winner = calculateWinner(currentState.squares); // null if no winner

//     // rendering moves in game history
//     const moves = gameHistory.map((step, move) => {
//       const desc = move ? 
//         'Move #: ' + move : 'Game start';
//       // jump to (re-render) each move on click, each move stored in ordered list
//       return (
//         <li key={move}>
//           <button onClick = {() => this.jumpTo(move)}>{desc}</button>;
//         </li>
//       ); 
//     });

//     let gameStatus; 
//     if (winner){
//       gameStatus = 'Winner: ' + winner;
//     } 
//     else{
//       gameStatus = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
//     }

//     // renders board, passes onClick 
//     // note: onEffect
//     return (
//       <div className="game">
//         <div className="game-board">
//         <Board 
//           //note: place state hook functions here 
//           squares={currentState.squares}
//           onClick={(i) => this.handleClick(i)}
//         />
//         </div>
//         <div className="game-info">
//         <div>{gameStatus}</div>
//         <ol>{moves}</ol>
//         </div>
//       </div>
//     );
//   }
// }

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
  