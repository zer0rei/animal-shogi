import React from "react";
import PropTypes from "prop-types";
import { cls } from "../../helpers";
import ResultIllustration from "../ResultIllustration";
import styles from "./Result.module.css";

function Result({ className, didSkyWin, isDraw, onClose, onReset }) {
  let message;
  let illustrationClassName;
  let actionButtonClassName;

  if (isDraw) {
    message = "IT'S A DRAW!";
    illustrationClassName = styles.backgroundStar;
    actionButtonClassName = styles.backgroundButton;
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
  didSkyWin: false,
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
