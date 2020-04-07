import React from "react";
import PropTypes from "prop-types";
import { randomize, cls } from "../../helpers";
import styles from "./Cloud.module.css";

function Cloud({ className }) {
  const randomize5 = (num) => randomize(num, 5);
  return (
    <svg viewBox="0 0 210 130" className={cls(styles.cloud, className)}>
      <circle cx="100" cy="55" r={randomize5(50)} />
      <circle cx="80" cy="90" r={randomize5(35)} />
      <circle cx="40" cy="70" r={randomize5(35)} />
      <circle cx="130" cy="95" r={randomize5(25)} />
      <circle cx="170" cy="80" r={randomize5(35)} />
      <circle cx="155" cy="40" r={randomize5(35)} />
    </svg>
  );
}

Cloud.defaultProps = {
  className: "",
};

Cloud.propTypes = {
  className: PropTypes.string,
};

export default Cloud;
