import React from "react";
import PropTypes from "prop-types";
import Cloud from "../Cloud";
import { randomize, cls } from "../../helpers";
import styles from "./Sky.module.css";

function Sky({ className, style }) {
  const randomize5 = (num) => randomize(num, 5);
  return (
    <div className={cls(styles.container, className)} style={style}>
      <svg
        viewBox="0 0 500 150"
        preserveAspectRatio="none"
        className={styles.base}
      >
        <path
          d={`M0,150 Q75,${randomize5(
            95
          )} 150,130 T300,130 T450,130 L500,150 L500,0 L0,0 Z`}
          className={styles.path}
        />
      </svg>
      <Cloud className={styles.cloudLeft} />
      <Cloud className={styles.cloudMiddle} />
      <Cloud className={styles.cloudRight} />
    </div>
  );
}

Sky.defaultProps = {
  className: "",
};

Sky.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Sky;
