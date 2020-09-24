import React, { Component } from "react";
import Board from "./components/board";
import HistoryBoard from "./components/historyBoard";
import FacebookLogin from "react-facebook-login";
import "bootstrap/dist/css/bootstrap.min.css";
import style from "./App.css";

const apikey = process.env.REACT_APP_APIKEY;

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      squareList: [null, null, null, null, null, null, null, null, null],
      isXNext: true,
      winner: null,
      history: [],
      isLogIn: false,
      username: "",
      topscores: [],
      timeStart: null,
      timeEnd: null,
      playTime: null,
      gameOver: false,
    };
  }

  squareClicked = (id) => {
    if (this.state.winner !== null) {
      return;
    }

    // time start
    if (this.state.history.length == 0) {
      this.setState({ ...this.state, timeStart: Date.now() });
    }

    let array = this.state.squareList;
    if (array[id] !== null) {
      alert(" click another square");
      return;
    }
    array[id] = this.state.isXNext ? "X" : "O";
    let winnerValue = this.calculateWinner(array);
    let historyArray = this.state.history;
    historyArray.push(array);

    // time end
    if (this.state.history.length == 8 || winnerValue) {
      let timeEnd = Date.now();
      this.setState({
        ...this.state,
        username: this.state.username,
        timeEnd: timeEnd,
        gameOver: true,
      });
      this.postData(timeEnd);
    }

    this.setState({
      squareList: [...array],
      isXNext: !this.state.isXNext,
      winner: winnerValue,
      history: [...historyArray],
    });
  };

  calculateWinner = (squares) => {
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
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return squares[c];
      }
    }
    return null;
  };

  goToPast = (idx) => {
    this.setState({
      ...this.state,
      squareList: this.state.history[idx],
      isXNext: idx % 2 === 1,
    });
  };

  postData = async (end) => {
    let data = new URLSearchParams();
    data.append("player", this.state.username);
    // console.log("this.state.timestart", this.state.timeStart);
    // console.log("this.state.timeEnd", this.state.timeEnd);
    // let playTime = {Math.round((this.state.timeEnd - this.state.timeStart) / 1000)};
    data.append("score", `${Math.round((end - this.state.timeStart) / 1000)}`);
    console.log("data", data);
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev`;
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: data.toString(),
      json: true,
    });

    console.log("final response", response);

    this.getData();
  };

  getData = async () => {
    const url = `https://ftw-highscores.herokuapp.com/tictactoe-dev?limit=70`;
    const response = await fetch(url);
    const data = await response.json();
    console.log("getdata", data);
    this.setState({ ...this.state, topscores: data.items });
  };

  responseFacebook = (response) => {
    console.log("response from facebook:", response);
    console.log("response.items ", response.items);
    this.setState({ ...this.state, username: response.name, isLogIn: true });
  };

  render() {
    return (
      <div className="container mt-5">
        <div className="play-board">
          {this.state.isLogIn ? (
            <div>{this.state.username}</div>
          ) : (
            <FacebookLogin
              autoLoad={false}
              appId={apikey}
              fields="name,email,picture"
              callback={this.responseFacebook}
            />
          )}

          {this.state.gameOver ? (
            <p className="mt-5">
              Play time:{" "}
              {Math.round((this.state.timeEnd - this.state.timeStart) / 1000)}
            </p>
          ) : (
            ""
          )}

          {this.state.isXNext ? (
            <h5 className="mt-5 mb-5">Next Player: X</h5>
          ) : (
            <h5 className="mt-5 mb-5">next Player: O</h5>
          )}

          <Board
            squareClicked={this.squareClicked}
            squareList={this.state.squareList}
          />

          {this.state.winner ? <h1>Winner is :{this.state.winner}</h1> : <></>}

          <div className="buttons mt-3 mb-5">
            <button className="mr-3" onClick={() => this.postData()}>post Data</button>
            <button onClick={() => this.getData()}>get Data</button>
          </div>

          <HistoryBoard history={this.state.history} goToPast={this.goToPast} />
        </div>

        <div className="top-scores">
          <h5>Top scores</h5>
          <div>
            {this.state.topscores.map((item) => {
              return (
                <div>
                  <span>{item.player}</span>
                  <span>{item.score}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }
}
