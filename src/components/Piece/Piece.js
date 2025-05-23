import React, { useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import { AnimalsContext, BoardDimensionsContext } from "../../contexts";
import { cls } from "../../helpers";
import styles from "./Piece.module.css";

function Piece({ className, type, isSky }) {
  const boardDimensions = useContext(BoardDimensionsContext);
  const animals = useContext(AnimalsContext);
  const [pieceWidth, setPieceWidth] = useState(0);
  // Destructure skyColor as well
  const { color, skyColor, image, moves } = animals[type]; 

  const measuredPieceRef = useCallback(
    (node) => {
      if (node !== null) {
        setPieceWidth(node.getBoundingClientRect().width);
      }
    },
    [boardDimensions.width, boardDimensions.height]
  );

  const moveIndicatorSize = Math.ceil(pieceWidth * 0.05);

  // Determine the backgroundColor based on isSky
  const pieceColor = isSky ? skyColor : color;

  return (
    <div
      className={cls(styles.base, className)}
      ref={measuredPieceRef}
      style={{
        backgroundColor: pieceColor || "white", // Updated color logic
        transform: isSky && "rotate(180deg)",
        backgroundImage: `url(${image})`,
      }}
    >
      {moves.map((move) => {
        const moveType = move[0] === "s" ? "dot" : "triangle";
        const corner = move.substr(1);
        return (
          moveIndicatorSize && (
            <span
              key={move}
              className={styles[`${moveType}-${corner}`]}
              style={{ width: moveIndicatorSize, height: moveIndicatorSize }}
            />
          )
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
