import React from "react";
import PropTypes from "prop-types";
import { cls } from "../../helpers";
import styles from "./IconButton.module.css";

function IconButton({ className, icon, text, onClick }) {
  return (
    <button
      className={cls(styles.base, className)}
      onClick={onClick}
      style={{ backgroundImage: icon && `url(${icon})` }}
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
  alt: PropTypes.string,
  onClick: PropTypes.func,
};

export default IconButton;
