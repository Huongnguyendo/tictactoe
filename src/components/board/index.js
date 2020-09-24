import React from "react";
import Square from "../square";
import style from "./board.module.css";

const Board = ({ squareClicked, squareList }) => {
  const renderSquare = (id) => {
    return (
      <Square squareClicked={squareClicked} id={id} squareList={squareList} />
    );
  };
  return (
    <div>
      <div style={{ display: "flex" }}>
        {renderSquare(0)}
        {renderSquare(1)}
        {renderSquare(2)}
      </div>
      <div style={{ display: "flex" }}>
        {renderSquare(3)}
        {renderSquare(4)}
        {renderSquare(5)}
      </div>
      <div style={{ display: "flex" }}>
        {renderSquare(6)}
        {renderSquare(7)}
        {renderSquare(8)}
      </div>
    </div>
  );
};

export default Board;

