import React from 'react';
import style from "./square.module.css";

const Square = ({squareClicked, id, squareList}) => {
    return (
        <div className={style["square-box"]} onClick={() => squareClicked(id)}>
            {squareList[id]}
        </div>
    )
}

export default Square
