import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
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
    let boardMatrix = [];
    for (let row = 0; row <= 2; row++) {
      let boardRow = [];
      for (let col = 0; col <= 2; col++) {
        boardRow.push(
          <span className="board-square" key={row * 3 + col}>
            {this.renderSquare(row * 3 + col)}
          </span>
        );
      }
      boardMatrix.push(
        <div className="board-square" key={row}>
          {boardRow}
        </div>
      );
    }

    return <div>{boardMatrix}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
          clickedSquare: [null, null]
        }
      ],
      stepNumber: 0,
      XIsNext: true
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares) || squares[i]) return;

    squares[i] = this.state.XIsNext ? "X" : "O";

    this.setState({
      history: history.concat([
        {
          squares: squares,
          clickedSquare: [Math.floor(i % 3) + 1, Math.floor(i / 3 + 1)]
        }
      ]),
      stepNumber: history.length,
      XIsNext: !this.state.XIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      XIsNext: step % 2 === 0
    });
  }

  sortMoves() {
    this.setState({
      ascending: !this.state.ascending
    });
  }

  render() {
    const selected = { fontWeight: "bold" };
    const deselected = { fontWeight: "normal" };
    const ascending = this.state.ascending;

    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const clickedSquare = step.clickedSquare;
      const desc = move
        ? `Go to move #${move} - (${clickedSquare[0]},${clickedSquare[1]})`
        : "Go to game start";

      return (
        <li key={move}>
          <button
            style={this.state.stepNumber === move ? selected : deselected}
            onClick={() => this.jumpTo(move)}
          >
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) status = "Winner: " + winner;
    else status = "Next player: " + (this.state.XIsNext ? "X" : "O");

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.sortMoves()}>
            Ascending/Descending List
          </button>
          <ol>{ascending ? moves : moves.reverse()}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
