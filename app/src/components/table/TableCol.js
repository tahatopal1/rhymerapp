import React from "react";
import "./TableCol.css";

const TableCol = (props) => {
  return <div className="table-col">{props.children}</div>;
};

export default TableCol;
