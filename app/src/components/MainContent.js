import React from "react";
import "./MainContent.css";
import TablePage from "./table/TablePage";

const MainContent = (props) => {
  return (
    <div className="main-content vh-100 radius">
      <TablePage wideDummy={props.wideDummy} />
    </div>
  );
};

export default MainContent;
