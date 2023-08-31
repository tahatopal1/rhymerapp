import React, { useState } from "react";
import logo from "./logomus.png";
import "./App.css";
import Sidebar from "./components/Sidebar";
import MainContent from "./components/MainContent";

function App() {
  const [wideDummy, setWideDummy] = useState({ dummy: "dummy" });

  return (
    <div className="container">
      <Sidebar
        logo={logo}
        onImport={() => {
          setWideDummy({ ...wideDummy });
        }}
      />
      <MainContent wideDummy={wideDummy} />
    </div>
  );
}

export default App;
