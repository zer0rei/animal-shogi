import React, { useState, useEffect } from "react";
import { WindowDimensionsContext } from "../../contexts";
import Game from "../Game";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

const config = {
  gameType: "mini",
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

  return (
    <WindowDimensionsContext.Provider value={windowDimensions}>
      <Game config={config} />
    </WindowDimensionsContext.Provider>
  );
}

export default App;
