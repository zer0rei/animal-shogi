import React from "react";
import PropTypes from "prop-types";
import { cls } from "../../helpers";
import ResultIllustration from "../ResultIllustration";
import styles from "./Result.module.css";

function Result({ className, didSkyWin, isDraw, onClose, onReset }) {
  let message;
  let illustrationClassName; // Used for ResultIllustration's main class
  let actionButtonClassName;

  if (isDraw) {
    message = "IT'S A DRAW!";
    // Assuming no specific draw illustration, use a neutral or default style
    illustrationClassName = styles.landStar; // Or a new 'drawStar' if defined
    actionButtonClassName = styles.landButton; // Or a neutral button style
  } else if (didSkyWin) {
    message = "SKY WINS";
    illustrationClassName = styles.skyStar;
    actionButtonClassName = styles.skyButton;
  } else {
    message = "LAND WINS";
    illustrationClassName = styles.landStar;
    actionButtonClassName = styles.landButton;
  }

  return (
    <>
      <div className={styles.background} />
      <div className={cls(styles.container, className)}>
        <ResultIllustration
          className={illustrationClassName}
        />
        <h1 className={styles.resultText}>{message}</h1>
        <div className={styles.actionButtonContainer}>
          <button className={actionButtonClassName} onClick={onReset}>
            REPLAY
          </button>
          <button className={actionButtonClassName} onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </>
  );
}

Result.defaultProps = {
  className: "",
  didSkyWin: false, // Explicitly define default for clarity
  isDraw: false, 
};

Result.propTypes = {
  className: PropTypes.string,
  didSkyWin: PropTypes.bool,
  isDraw: PropTypes.bool,
  onClose: PropTypes.func,
  onReset: PropTypes.func,
};

export default Result;
