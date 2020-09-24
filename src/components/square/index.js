import React from "react";
import styles from "./square.module.css";

const Square = ({ squareClicked, id, squareList }) => {
  return (
    <div className={styles["square-box"]} onClick={() => squareClicked(id)}>
      
      <h2>{squareList[id]}</h2>
    </div>
  );
};

export default Square;