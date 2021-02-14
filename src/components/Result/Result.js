import React from "react";
import PropTypes from "prop-types";
import IconButton from "../IconButton";
import resetIcon from "../../assets/reset-icon.svg";
import { cls } from "../../helpers";
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
        <svg
          className={didSkyWin ? styles.skyStar : styles.landStar}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 493 458"
        >
          <path
            fillRule="evenodd"
            d="M439.2726,400.974182 C439.2726,400.974182 260.156825,262.424142 244.537849,457.530601 C244.537849,457.530601 244.537849,260.406277 55.7731696,405.416017 C55.7731696,405.416017 169.327798,284.168312 0,223.719869 C0,223.719869 63.7300189,228.223142 100.312407,206.23294 C137.580095,183.830794 128.918609,140.598574 55.7731696,67.8472771 C45.2623285,61.8466231 223.956209,195.106459 234.366628,0 C275.382999,208.375698 434.814939,49.1485683 434.814939,49.1485683 C434.814939,49.1485683 264.636446,228.7653 492.378307,222.310098 C503.234137,222.002396 336.593038,263.261558 439.2726,400.974182 Z"
          />
        </svg>
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
