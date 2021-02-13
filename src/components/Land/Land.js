import React from "react";
import PropTypes from "prop-types";
import SimpleFlower from "../SimpleFlower";
import { randomize, times, cls } from "../../helpers";
import styles from "./Land.module.css";

const randomize5 = (num) => randomize(num, 5);
const r50 = randomize5(0);
const r550 = randomize5(50);
const r5_40 = randomize5(-40);
const r5_20 = randomize5(-20);

function Land({ className, style }) {
  return (
    <div className={cls(styles.container, className)} style={style}>
      <svg
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
        className={styles.base}
      >
        <path
          d={`M0,20 Q70,${r50} 130,${r550} Q190,${r5_40} 250,${r550} Q310,${r5_40} 370,${r550} Q430,${r5_20} 500,20 L500,500 L0,500 Z`}
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
