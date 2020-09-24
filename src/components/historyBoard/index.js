import React from "react";

const HistoryBoard = ({ history, goToPast }) => {
  return (
    <div>
      {history.map((item, idx) => (
        <button style={{display: "block"}} onClick={() => goToPast(idx)}>Move to {idx + 1}</button>
      ))}
    </div>
  );
};

export default HistoryBoard;