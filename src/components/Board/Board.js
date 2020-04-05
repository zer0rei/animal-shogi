import React, { useState, useRef, useEffect } from "react";
import PropTypes from "prop-types";
import Background from "../Background";
import Piece from "../Piece";
import { times, toAlpha } from "../../helpers";
import styles from "./Board.module.css";

function getWindowDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
}

function Board({ squares, numRows, numCols, numRowsInSky }) {
  const [windowDimensions, setWindowDimensions] = useState(
    getWindowDimensions()
  );
  const [boardDimensions, setBoardDimensions] = useState({
    height: "auto",
    width: "auto",
  });
  const boardEl = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const currentWindowDimensions = getWindowDimensions();
      const aspectRatio =
        currentWindowDimensions.width / currentWindowDimensions.height;
      setWindowDimensions(currentWindowDimensions);
      let boardHeight = "auto";
      let boardWidth = "auto";
      if (aspectRatio >= numCols / numRows) {
        boardWidth = boardEl.current.offsetHeight * (numCols / numRows);
      } else {
        boardHeight = boardEl.current.offsetWidth * (numRows / numCols);
      }
      setBoardDimensions({
        height: boardHeight,
        width: boardWidth,
      });
    };
    handleResize();
    // show board after calculating dimensions
    boardEl.current.style.visibility = "visible";

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const currentBoardHeight = isNaN(boardDimensions.height)
    ? 0.8 * windowDimensions.height
    : boardDimensions.height;
  const skyHeight =
    (windowDimensions.height - currentBoardHeight) / 2 +
    ((currentBoardHeight * numRowsInSky) / numRows) * 1.1;
  return (
    <>
      <Background skyHeight={skyHeight} landHeight={skyHeight} />
      <div
        className={styles.board}
        ref={boardEl}
        style={{ ...boardDimensions }}
      >
        {times(numRows, (i) => (
          <div key={i} className={styles.boardRow} style={{}}>
            <div className={styles.rowLabel}>{i + 1}</div>
            {times(numCols, (j) => {
              const { isEmpty, type, isSky } = squares[i][j];
              return (
                <div key={j} className={styles.boardSquare}>
                  {i === 0 && (
                    <div className={styles.columnLabel}>{toAlpha(j + 1)}</div>
                  )}
                  {isEmpty || <Piece type={type} isSky={isSky} />}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </>
  );
}

Board.propTypes = {
  squares: PropTypes.array,
  numCols: PropTypes.number,
  numRows: PropTypes.number,
  numRowsInSky: PropTypes.number,
};

export default Board;
