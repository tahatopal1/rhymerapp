import React from "react";
import "./MiniTableItemContainer.css";
import MiniTableItem from "./MiniTableItem";

const MiniTableItemContainer = (props) => {
  return (
    <div className="mini-table-item-container">
      {props.data.map((dt, i) => (
        <MiniTableItem
          data={dt}
          key={i}
          onRemoveItem={() => {
            props.onRemoveItem(props.row, i);
          }}
          onDrop={(e) => {
            e.stopPropagation();
            props.onDrop(e, props.row, i);
          }}
        />
      ))}
    </div>
  );
};

export default MiniTableItemContainer;
