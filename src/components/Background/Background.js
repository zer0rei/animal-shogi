import React from "react";
import PropTypes from "prop-types";
import Sky from "../Sky";
import Land from "../Land";
import styles from "./Background.module.css";

function Background({ className, skyHeight, landHeight }) {
  return (
    <div className={`${styles.world} ${className}`}>
      <Sky className={styles.sky} style={{ height: skyHeight }} />
      <Land className={styles.land} style={{ height: landHeight }} />
    </div>
  );
}

Background.defaultProps = {
  className: "",
};

Background.propTypes = {
  className: PropTypes.string,
};

export default Background;
