import React from "react";
import PropTypes from "prop-types";
import { cls } from "../../helpers";
import styles from "./IconButton.module.css";

function IconButton({ className, icon, text, onClick, ariaLabel }) {
  return (
    <button
      className={cls(styles.base, className)}
      onClick={onClick}
      style={{ backgroundImage: icon && `url(${icon})` }}
      aria-label={ariaLabel}
    >
      {!icon ? text : ""}
    </button>
  );
}

IconButton.defaultProps = {
  className: "",
  text: "",
};

IconButton.propTypes = {
  className: PropTypes.string,
  icon: PropTypes.string,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
};

export default IconButton;
