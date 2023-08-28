import React from "react";
import "./TableRow.css";

const TableRow = (props) => {
  const handleOnDrag = (e, info) => {
    e.dataTransfer.setData("info", info);
  };

  return (
    <div
      className="table-row"
      draggable
      onDragStart={(e) => {
        handleOnDrag(e, props.content);
      }}
    >
      {props.children}
    </div>
  );
};

export default TableRow;
