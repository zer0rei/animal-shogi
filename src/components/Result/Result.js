import React from "react";
import PropTypes from "prop-types";
import { cls } from "../../helpers";
import ResultIllustration from "../ResultIllustration";
import styles from "./Result.module.css";

function Result({ className, didSkyWin, onClose, onReset }) {
  const resultMessage = didSkyWin ? "SKY WINS" : "LAND WINS";
  const actionButtonClassName = didSkyWin
    ? styles.skyButton
    : styles.landButton;
  return (
    <>
      <div className={styles.background} />
      <div className={cls(styles.container, className)}>
        <ResultIllustration
          className={didSkyWin ? styles.skyStar : styles.landStar}
        />
        <h1 className={styles.resultText}>{resultMessage}</h1>
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
};

Result.propTypes = {
  className: PropTypes.string,
  didSkyWin: PropTypes.bool,
  onClose: PropTypes.func,
  onReset: PropTypes.func,
};

export default Result;
