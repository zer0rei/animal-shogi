import React, { useRef, useContext } from "react";
import PropTypes from "prop-types";
import { AnimalContext } from "../../contexts";
import styles from "./Piece.module.css";

function Piece({ className, type, isSky }) {
  const pieceEl = useRef(null);
  const animals = useContext(AnimalContext);
  const { color, image, moves } = animals[type];
  const moveIndicatorSize = pieceEl.current
    ? Math.ceil(pieceEl.current.offsetHeight * 0.05)
    : 0;

  return (
    <div
      className={`${styles.base} ${className}`}
      ref={pieceEl}
      style={{
        backgroundColor: color || "white",
        transform: isSky && "rotate(180deg)",
        backgroundImage: `url(${image})`,
      }}
    >
      {moves.map((move) => {
        const moveType = move[0] === "s" ? "dot" : "triangle";
        const corner = move.substr(1);
        return (
          <span
            key={move}
            className={styles[`${moveType}-${corner}`]}
            style={{ width: moveIndicatorSize, height: moveIndicatorSize }}
          />
        );
      })}
    </div>
  );
}

Piece.defaultProps = {
  className: "",
  isSky: false,
};

Piece.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  isSky: PropTypes.bool,
};

export default Piece;
