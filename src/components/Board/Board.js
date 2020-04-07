import React, { useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import {
  WindowDimensionsContext,
  PiecesStateContext,
  BoardDimensionsContext,
} from "../../contexts";
import Background from "../Background";
import DroppableSquare from "../DroppableSquare";
import DraggablePiece from "../DraggablePiece";
import { times, toAlpha } from "../../helpers";
import styles from "./Board.module.css";

const maxBoardHeightPercent = 0.8;
const maxBoardWidthPercent = 0.85;

function Board({ numRows, numCols, numRowsInSky }) {
  const pieces = useContext(PiecesStateContext);
  const squares = pieces.board;
  const windowDimensions = useContext(WindowDimensionsContext);
  const [boardDimensions, setBoardDimensions] = useState({
    width: "auto",
    height: "auto",
  });
  const [pieceContainerDimensions, setPieceContainerDimensions] = useState({
    width: 0,
    height: 0,
  });

  const measuredBoardRef = useCallback(
    (node) => {
      if (node !== null) {
        let boardHeight = "auto";
        let boardWidth = "auto";
        const aspectRatio = windowDimensions.width / windowDimensions.height;
        const autoBoardHeight = maxBoardHeightPercent * windowDimensions.height;
        const autoBoardWidth = maxBoardWidthPercent * windowDimensions.width;
        if (aspectRatio >= numCols / numRows) {
          boardWidth = autoBoardHeight * (numCols / numRows);
        } else {
          boardHeight = autoBoardWidth * (numRows / numCols);
        }
        setBoardDimensions({
          height: boardHeight,
          width: boardWidth,
        });
        // show board after calculating dimensions
        node.style.visibility = "visible";
      }
    },
    [windowDimensions.height, windowDimensions.width, numCols, numRows]
  );

  const measuredPieceContainerRef = useCallback(
    (node) => {
      if (node !== null) {
        const { width, height } = node.getBoundingClientRect();
        setPieceContainerDimensions({ width, height });
      }
    },
    [boardDimensions.height, boardDimensions.width]
  );

  const currentBoardHeight = isNaN(boardDimensions.height)
    ? maxBoardHeightPercent * windowDimensions.height
    : boardDimensions.height;
  const skyHeight =
    (windowDimensions.height - currentBoardHeight) / 2 +
    ((currentBoardHeight * numRowsInSky) / numRows) * 1.1;
  return (
    <BoardDimensionsContext.Provider value={boardDimensions}>
      <Background skyHeight={skyHeight} landHeight={skyHeight} />
      <div
        className={styles.board}
        ref={measuredBoardRef}
        style={{
          ...boardDimensions,
          maxHeight: `${maxBoardHeightPercent * 100}%`,
          maxWidth: `${maxBoardWidthPercent * 100}%`,
        }}
      >
        {times(numRows, (i) => (
          <div key={i} className={styles.boardRow} style={{}}>
            <div className={styles.rowLabel}>{i + 1}</div>
            {times(numCols, (j) => {
              const { isEmpty, type, isSky } = squares[i][j];
              return (
                <DroppableSquare
                  key={j}
                  className={styles.boardSquare}
                  position={{ x: i, y: j }}
                >
                  {i === 0 && (
                    <div className={styles.columnLabel}>{toAlpha(j + 1)}</div>
                  )}
                  {isEmpty || (
                    <div
                      className={styles.pieceContainer}
                      ref={measuredPieceContainerRef}
                    >
                      <DraggablePiece
                        type={type}
                        isSky={isSky}
                        position={{ x: i, y: j }}
                        height={pieceContainerDimensions.height}
                        width={pieceContainerDimensions.width}
                      />
                    </div>
                  )}
                </DroppableSquare>
              );
            })}
          </div>
        ))}
      </div>
    </BoardDimensionsContext.Provider>
  );
}

Board.propTypes = {
  numCols: PropTypes.number,
  numRows: PropTypes.number,
  numRowsInSky: PropTypes.number,
};

export default Board;
