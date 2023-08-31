import React from "react";
import "./Sidebar.css";
import LyricsToolbar from "./lyrics-toolbar/LyricsToolbar";

const Sidebar = (props) => {
  return (
    <div className="sidebar vh-100">
      <div className="img-container">
        <img src={props.logo} />
      </div>
      <LyricsToolbar onImport={props.onImport} />
    </div>
  );
};

export default Sidebar;
