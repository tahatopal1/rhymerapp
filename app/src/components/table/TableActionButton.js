import React from "react";
import "./TableActionButton.css";

const TableActionButton = (props) => {
  return (
    <div onClick={props.onClick} className={props.className}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
        className="icon"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={props.svgData} />
      </svg>
    </div>
  );
};

export default TableActionButton;
