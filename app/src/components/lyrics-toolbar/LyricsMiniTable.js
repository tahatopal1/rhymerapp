import React from "react";
import "./LyricsMiniTable.css";
import MiniTableItemContainer from "./MiniTableItemContainer";

const LyricsMiniTable = (props) => {
  const handlerOnDragLeave = (e) => {
    e.stopPropagation();
    e.target.classList.remove("lyrics-mini-table-dragged");
  };

  return (
    <div
      className="lyrics-mini-table"
      onDragOver={props.onDragOver}
      onDrop={props.onDrop}
      onDragLeave={handlerOnDragLeave}
    >
      {props.data.map((itmCon, i) => (
        <MiniTableItemContainer
          data={itmCon}
          key={i}
          row={i}
          onRemoveItem={props.onRemoveItem}
          onDrop={props.onDropItem}
        />
      ))}
    </div>
  );
};

export default LyricsMiniTable;
