import React, { useState, useEffect } from "react";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
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

function App() {
  const [gameType, setGameType] = useState("micro");
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const handleConfigChange = (newConfigSettings) => {
    if (newConfigSettings.hasOwnProperty('gameType')) {
      setGameType(newConfigSettings.gameType);
    }
  };

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
    <DndProvider backend={Backend} options={HTML5toTouch}>
      <WindowDimensionsContext.Provider value={windowDimensions}>
        <Game
          key={gameType}
          config={{ gameType }}
          onHelp={handleHelp}
          onConfigChange={handleConfigChange}
        />
      </WindowDimensionsContext.Provider>
    </DndProvider>
  );
}

export default App;
