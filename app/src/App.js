import React from "react";
import logo from "./logomus.png";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  return (
    <div className="container">
      <Sidebar logo={logo} />
      <MainContent />
    </div>
  );
}

export default App;
