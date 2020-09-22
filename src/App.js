import React, { Component } from "react";
import Board from "./components/board";

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{ squareList: Array(9).fill(null) }],
      isXNext: true,
      stepNumber: 0,
    };
  }

  squareClicked = (id) => {
    let history = this.state.history.slice(0, this.state.stepNumber + 1);
    let current = history[history.length - 1];

    // let array = this.state.squareList;
    let squareList = current.squareList.slice();

    // check if there is a winner, or a squared already been clicked
    if (this.renderWinner(squareList) || squareList[id]) {
      return;
    }

    // check if next player is X or O
    squareList[id] = this.state.isXNext ? "X" : "O";

    // change player
    this.setState({
      history: history.concat([
        {
          squareList: squareList,
        },
      ]),
      stepNumber: history.length,
      isXNext: !this.state.isXNext,
    });
  };

  renderWinner = (array) => {
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

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (array[a] && array[a] === array[b] && array[b] === array[c]) {
        return array[a];
      }
    }
    return;
  };

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      isXNext: step % 2 === 0,
    });
  }

  render() {
    let history = this.state.history;
    let current = history[this.state.stepNumber];

    let moves = history.map((step, move) => {
      const desc = move ? "Go to #" + move : "Start game";
      return (
        <li key={move}>
          <button
            onClick={() => {
              this.jumpTo(move);
            }}
          >
            {desc}
          </button>
        </li>
      );
    });

    let winner = this.renderWinner(current.squareList);
    let status;

    if (winner) {
      status = "Winner is: " + winner;
    } else {
      status = "Next player: " + (this.state.isXNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div >
          <Board
            squareClicked={this.squareClicked}
            squareList={current.squareList}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
