import React, { useState } from "react";
import "./MiniTableItem.css";

const MiniTableItem = (props) => {
  const handlerOnDragLeave = (e) => {
    e.stopPropagation();
    e.target.classList.remove("mini-table-item-dragged");
  };

  return (
    <div
      className="mini-table-item"
      onDragLeave={handlerOnDragLeave}
      onClick={props.onRemoveItem}
      onDrop={props.onDrop}
    >
      {props.data}
    </div>
  );
};

export default MiniTableItem;
