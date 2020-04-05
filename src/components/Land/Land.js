import React from "react";
import PropTypes from "prop-types";
import SimpleFlower from "../SimpleFlower";
import { randomize, times } from "../../helpers";
import styles from "./Land.module.css";

function Land({ className, style }) {
  const randomize5 = (num) => randomize(num, 5);
  return (
    <div className={`${styles.container} ${className}`} style={style}>
      <svg
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
        className={styles.base}
      >
        <path
          d={`M0,20 Q70,${randomize5(0)} 130,${randomize5(
            50
          )} Q190,${randomize5(-40)} 250,${randomize5(50)} Q310,${randomize5(
            -40
          )} 370,${randomize5(50)} Q430,${randomize5(
            -20
          )} 500,20 L500,500 L0,500 Z`}
          className={styles.path}
        />
      </svg>
      {times(5, (i) => (
        <SimpleFlower
          key={i}
          className={styles.flower}
          style={{ bottom: "40%", left: `${(i + 1) * 20 - 10}%` }}
        />
      ))}
      {times(4, (i) => (
        <SimpleFlower
          key={i}
          className={styles.flower}
          style={{ bottom: "15%", left: `${(i + 1) * 20}%` }}
        />
      ))}
    </div>
  );
}

Land.defaultProps = {
  className: "",
};

Land.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Land;
