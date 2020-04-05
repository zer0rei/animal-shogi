import React from "react";
import PropTypes from "prop-types";
import { randomize } from "../../helpers";
import styles from "./SimpleFlower.module.css";

function SimpleFlower({ className, style }) {
  const randomize1 = (num) => randomize(num, 1);
  return (
    <svg
      viewBox="0 0 50 50"
      className={`${styles.flower} ${className}`}
      transform={`rotate(${randomize(180, 180)})`}
      style={style}
    >
      <circle cx={randomize1(25)} cy="25" r={13} />
      <circle cx={randomize1(15)} cy="15" r={randomize1(10)} />
      <circle cx={randomize1(35)} cy="12" r={randomize1(10)} />
      <circle cx={randomize1(12)} cy="32" r={randomize1(10)} />
      <circle cx={randomize1(25)} cy="39" r={randomize1(10)} />
      <circle cx={randomize1(38)} cy="30" r={randomize1(10)} />
    </svg>
  );
}

SimpleFlower.defaultProps = {
  className: "",
};

SimpleFlower.propTypes = {
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SimpleFlower;
