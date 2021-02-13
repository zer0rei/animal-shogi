import React, { useState, useCallback, useContext } from "react";
import PropTypes from "prop-types";
import {
  WindowDimensionsContext,
  GameStateContext,
  BoardDimensionsContext,
} from "../../contexts";
import Background from "../Background";
import BoardSquare from "../BoardSquare";
import BoardPiece from "../BoardPiece";
import { times, toAlpha } from "../../helpers";
import styles from "./Board.module.css";

const maxBoardHeightPercent = 0.8;
const maxBoardWidthPercent = 0.8;

function Board({ numRows, numCols, numRowsInSky }) {
  const { pieces, isSkyTurn, result } = useContext(GameStateContext);
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

  const getAspectRatio = (width, height) => {
    const aspectRatio = width / height;
    return (aspectRatio * numRows) / numCols;
  };

  const measuredBoardRef = useCallback(
    (node) => {
      if (node !== null) {
        let boardHeight = "auto";
        let boardWidth = "auto";
        const aspectRatio = getAspectRatio(
          windowDimensions.width,
          windowDimensions.height
        );
        const autoBoardHeight = maxBoardHeightPercent * windowDimensions.height;
        const autoBoardWidth = maxBoardWidthPercent * windowDimensions.width;
        if (aspectRatio >= 1) {
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

  const capturedContainerWidth =
    (windowDimensions.width -
      (isNaN(boardDimensions.width)
        ? maxBoardWidthPercent * windowDimensions.width
        : boardDimensions.width)) /
    2;

  const capturedContainerHeight =
    (windowDimensions.height -
      (isNaN(boardDimensions.height)
        ? maxBoardHeightPercent * windowDimensions.height
        : boardDimensions.height)) /
    2;

  const pieceProps = {
    height: pieceContainerDimensions.height,
    width: pieceContainerDimensions.width,
    isSkyTurn: isSkyTurn,
    result: result,
  };

  const aspectRatio = getAspectRatio(
    windowDimensions.width,
    windowDimensions.height
  );

  return (
    <BoardDimensionsContext.Provider value={boardDimensions}>
      <Background skyHeight={skyHeight} landHeight={skyHeight} />
      <div
        className={styles.board}
        ref={measuredBoardRef}
        style={{
          height: boardDimensions.height,
          width: boardDimensions.width,
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
                <BoardSquare
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
                      <BoardPiece
                        type={type}
                        isSky={isSky}
                        position={{ x: i, y: j }}
                        {...pieceProps}
                      />
                    </div>
                  )}
                </BoardSquare>
              );
            })}
          </div>
        ))}
      </div>
      <div
        className={styles.skyCapturedContainer}
        style={{
          width:
            aspectRatio >= 1
              ? capturedContainerWidth
              : windowDimensions.width - 60,
          height:
            aspectRatio >= 1
              ? windowDimensions.height - 60
              : capturedContainerHeight,
          flexDirection: aspectRatio >= 1 ? "column" : "row",
          padding: aspectRatio >= 1 ? "8px 20px 8px 8px" : "8px 8px 20px 8px",
        }}
      >
        {pieces.captured.sky.map((capturedPiece, index) => (
          <div
            key={index}
            className={styles.capturedPiece}
            style={{
              height: pieceContainerDimensions.height,
              width: pieceContainerDimensions.width,
            }}
          >
            <BoardPiece
              type={capturedPiece.type}
              isSky={capturedPiece.isSky}
              position={index}
              {...pieceProps}
            />
          </div>
        ))}
      </div>
      <div
        className={styles.landCapturedContainer}
        style={{
          width:
            aspectRatio >= 1
              ? capturedContainerWidth
              : windowDimensions.width - 60,
          height:
            aspectRatio >= 1
              ? windowDimensions.height - 60
              : capturedContainerHeight,
          flexDirection: aspectRatio >= 1 ? "column-reverse" : "row-reverse",
          padding: aspectRatio >= 1 ? "8px 8px 8px 20px" : "20px 8px 8px 8px",
        }}
      >
        {pieces.captured.land.map((capturedPiece, index) => (
          <div
            key={index}
            className={styles.capturedPiece}
            style={{
              height: pieceContainerDimensions.height,
              width: pieceContainerDimensions.width,
            }}
          >
            <BoardPiece
              type={capturedPiece.type}
              isSky={capturedPiece.isSky}
              position={index}
              {...pieceProps}
            />
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
