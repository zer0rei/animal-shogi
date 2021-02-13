import React from "react";
import PropTypes from "prop-types";
import { randomize, cls } from "../../helpers";
import styles from "./SimpleFlower.module.css";

const randomize1 = (num) => randomize(num, 1);
const r180 = randomize(180, 180);
const r125 = randomize1(25);
const r115 = randomize1(15);
const r110 = randomize1(10);
const r112 = randomize1(12);
const r110b = randomize1(10);
const r135 = randomize1(35);
const r110c = randomize1(10);
const r125b = randomize1(25);
const r110d = randomize1(10);
const r138 = randomize1(38);
const r110e = randomize1(10);

function SimpleFlower({ className, style }) {
  return (
    <svg
      viewBox="0 0 50 50"
      className={cls(styles.flower, className)}
      transform={`rotate(${r180})`}
      style={style}
    >
      <circle cx={r125} cy="25" r={13} />
      <circle cx={r115} cy="15" r={r110} />
      <circle cx={r135} cy="12" r={r110b} />
      <circle cx={r112} cy="32" r={r110c} />
      <circle cx={r125b} cy="39" r={r110d} />
      <circle cx={r138} cy="30" r={r110e} />
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
