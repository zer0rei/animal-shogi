import React, { useState, useEffect } from "react";
import { WindowDimensionsContext } from "../../contexts";
import { helpURL } from "../../constants";
import Game from "../Game";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const config = {
  gameType: "micro",
};

function App() {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  useEffect(() => {
    const handleResize = () => {
      setWindowDimensions(getWindowDimensions());
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const handleHelp = () => {
    window.open(helpURL);
  };

  return (
    <WindowDimensionsContext.Provider value={windowDimensions}>
      <Game config={config} onHelp={handleHelp} />
    </WindowDimensionsContext.Provider>
  );
}

export default App;
