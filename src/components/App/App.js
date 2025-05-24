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

// const config = {
//   gameType: "micro",
// };

function App() {
  const [gameType, setGameType] = useState("micro");
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );

  const handleConfigChange = (newConfigSettings) => {
    if (newConfigSettings.hasOwnProperty('gameType')) {
      setGameType(newConfigSettings.gameType);
    }
    // Future settings could be handled here, e.g.:
    // if (newConfigSettings.hasOwnProperty('difficulty')) {
    //   setDifficulty(newConfigSettings.difficulty);
    // }
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
    <WindowDimensionsContext.Provider value={windowDimensions}>
      {/* The div containing the game type switching buttons has been removed */}
      <Game
        key={gameType}
        config={{ gameType: gameType }}
        onHelp={handleHelp}
        onConfigChange={handleConfigChange} // Changed from setGameType
      />
    </WindowDimensionsContext.Provider>
  );
}

export default App;
