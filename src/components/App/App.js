import React, { useState, useEffect } from "react";
import { WindowDimensionsContext } from "../../contexts";
import IconButton from "../IconButton";
import settingsIcon from "../../assets/settings-icon.svg";
import Game from "../Game";
import styles from "./App.module.css";

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

  return (
    <WindowDimensionsContext.Provider value={windowDimensions}>
      <Game config={config} />
      <div className={styles.iconButtonsContainer}>
        <IconButton icon={settingsIcon} alt="settings" />
        <IconButton className={styles.helpButton} text="?" />
      </div>
    </WindowDimensionsContext.Provider>
  );
}

export default App;
