import React from "react";
import PropTypes from "prop-types";
import { randomize, cls } from "../../helpers";
import styles from "./Cloud.module.css";

const randomize5 = (num) => randomize(num, 5);
const r550 = randomize5(50);
const r535 = randomize5(35);
const r535b = randomize5(35);
const r525 = randomize5(25);
const r535c = randomize5(35);
const r535d = randomize5(35);

function Cloud({ className }) {
  return (
    <svg viewBox="0 0 210 130" className={cls(styles.cloud, className)}>
      <circle cx="100" cy="55" r={r550} />
      <circle cx="80" cy="90" r={r535} />
      <circle cx="40" cy="70" r={r535b} />
      <circle cx="130" cy="95" r={r525} />
      <circle cx="170" cy="80" r={r535c} />
      <circle cx="155" cy="40" r={r535d} />
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
