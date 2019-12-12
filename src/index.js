import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// Obj structure:
//        Game: winner tracking, history, current player tracking, handling square clicks
//          |  
//        Board: defines square, passes state change to Square after onClick       
//          |
//          |(a function, not Obj)
//        Square: renders Square


function Square(props) {
  return (
      <button 
          className="square" 
          onClick={props.onClick}
      >   
      {props.value}
      </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
        <Square 
            value={this.props.squares[i]} 
            onClick={() => this.props.onClick(i)}
        />
    );
  }
  render() {
    // winner tracking and game state lifted up to Game obj
    // square rendering stil here
    return (
        <div>
            <div className="board-row">
            {this.renderSquare(0)}
            {this.renderSquare(1)}
            {this.renderSquare(2)}
            </div>
            <div className="board-row">
            {this.renderSquare(3)}
            {this.renderSquare(4)}
            {this.renderSquare(5)}
            </div>
            <div className="board-row">
            {this.renderSquare(6)}
            {this.renderSquare(7)}
            {this.renderSquare(8)}
            </div>
        </div>
    );
  }
}
  
// game state (and there4 what to render) encapsulated in Game obj
class Game extends React.Component {
  constructor(props){
    super(props);
    this.state = {
        history: [{
            squares: Array(9).fill(null),
        }],
        xIsNext: true,
        stepNumber: 0,
    };
  }
  // updates gamestate after square is clicked
  // game states are discretized via valid clicks
  handleClick(i){
    // design decision: history is only up until this step: discards future history
    //  if gone back to a certain move and made a move from there
    const gameHistory = this.state.history.slice(0, this.state.stepNumber + 1);
    const current_state = gameHistory[gameHistory.length-1];
    const squares = current_state.squares.slice();
    // if winner or square already filled
    if (calculateWinner(squares) || squares[i]){
      return;
    }
    // update value in square
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    // add updated state to history, next player's turn
    // NOTE: concat merges arrays and makes a new array
    // thus, the history obj gets updated (reassigned new arrays every time) 
    this.setState({
      history: gameHistory.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: gameHistory.length,
    });
  }
  // jump to int #step
  jumpTo(step){
    this.setState({
      stepNumber: step,
      // x is Next on even turns
      xIsNext: (step % 2) === 0,
    })
  }

  render() {
    const gameHistory = this.state.history; 
    const currentState = gameHistory[this.state.stepNumber]; 
    const winner = calculateWinner(currentState.squares); // null if no winner

    // rendering moves in game history
    const moves = gameHistory.map((step, move) => {
      const desc = move ? 
        'Move #: ' + move : 'Game start';
      // jump to (re-render) each move on click, each move stored in ordered list
      return (
        <li key={move}>
          <button onClick = {() => this.jumpTo(move)}>{desc}</button>;
        </li>
      ); 
    });

    let gameStatus; 
    if (winner){
      gameStatus = 'Winner: ' + winner;
    } 
    else{
      gameStatus = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    // renders board, passes onClick 
    return (
      <div className="game">
        <div className="game-board">
        <Board 
          squares={currentState.squares}
          onClick={(i) => this.handleClick(i)}
        />
        </div>
        <div className="game-info">
        <div>{gameStatus}</div>
        <ol>{moves}</ol>
        </div>
      </div>
    );
  }
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
  