import React, { useReducer, useState } from "react";
import PropTypes from "prop-types";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import Board from "../Board";
import IconButton from "../IconButton";
import Result from "../Result";
import resetIcon from "../../assets/reset-icon.svg";
import {
  GameStateContext,
  GameDispatchContext,
  AnimalsContext,
} from "../../contexts";
import getSettings from "./getSettings";
import getAnimals, { getPromoted, getDemoted, isPromoted } from "./getAnimals";
import getInitialPieces from "./getInitialPieces";
import styles from "./Game.module.css";

const isOutOfBound = (board, position) => {
  return (
    position.x < 0 ||
    position.x >= board.length ||
    position.y < 0 ||
    position.y >= board[0].length
  );
};

const validateDestination = (board, from, to, move) => {
  const xPositionsMap = { t: -1, m: 0, b: 1 };
  const yPositionsMap = { l: -1, m: 0, r: 1 };
  const fromPiece = board[from.x][from.y];
  const toPiece = board[to.x][to.y];
  if (move[0] === "s") {
    let destX = from.x;
    let destY = from.y;
    destX += (fromPiece.isSky ? -1 : 1) * xPositionsMap[move[1]];
    destY += (fromPiece.isSky ? -1 : 1) * yPositionsMap[move[2]];
    if (to.x !== destX || to.y !== destY) {
      return false;
    }
  }
  if (move[0] === "m") {
    return false;
  }
  if (!toPiece.isEmpty && fromPiece.isSky === toPiece.isSky) {
    return false;
  }
  return true;
};

const canMove = (gameType, pieces) => (from, to) => {
  const animals = getAnimals(gameType);
  const piece = pieces.board[from.x][from.y];
  const { moves } = animals[piece.type];
  for (let move of moves) {
    if (validateDestination(pieces.board, from, to, move)) {
      return true;
    }
  }
  return false;
};

const canDrop = (gameType, pieces) => (isSky, fromIndex, to) =>
  pieces.board[to.x][to.y].isEmpty;

const canBeCaptured = (gameType, pieces) => (pos) => {
  const square = pieces.board[pos.x][pos.y];
  if (gameType === "micro") {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (i === 0 && j === 0) continue;
        const adjPos = { x: pos.x + i, y: pos.y + j };
        if (!isOutOfBound(pieces.board, adjPos)) {
          const adjacentSquare = pieces.board[adjPos.x][adjPos.y];
          if (
            !adjacentSquare.isEmpty &&
            adjacentSquare.isSky !== square.isSky &&
            canMove(gameType, pieces)(adjPos, pos)
          ) {
            return true;
          }
        }
      }
    }
  }
  return false;
};

const piecesReducer = (gameType) => (state, action) => {
  switch (action.type) {
    case "reset": {
      return {
        initialState: state.initialState,
        ...state.initialState,
      };
    }
    case "move": {
      const { numRows } = getSettings(gameType);
      const numRowsInSky = Math.floor(numRows / 3);
      const { from, to } = action.payload;
      if (!state.result.didEnd && canMove(gameType, state.pieces)(from, to)) {
        let canPromote = null;
        let shouldPromote = null;
        const newCaptured = {
          land: state.pieces.captured.land.slice(),
          sky: state.pieces.captured.sky.slice(),
        };
        const result = {
          didEnd: false,
          didWin: false,
          didSkyWin: false,
        };
        const fromSquare = state.pieces.board[from.x][from.y];
        const toSquare = state.pieces.board[to.x][to.y];
        const newBoard = state.pieces.board.map((row, i) => {
          // irrelevent row: return as is
          if (i !== from.x && i !== to.x) {
            return row;
          }
          return row.map((square, j) => {
            if (i === from.x && j === from.y) {
              return {
                isEmpty: true,
              };
            }
            if (i === to.x && j === to.y) {
              return {
                ...fromSquare,
                isEmpty: false,
              };
            }
            return square;
          });
        });
        // promotion
        if (!isPromoted(fromSquare.type)) {
          if (fromSquare.isSky) {
            if (
              from.x >= numRows - numRowsInSky ||
              to.x >= numRows - numRowsInSky
            ) {
              if (fromSquare.type === "chick" && to.x === numRows - 1) {
                shouldPromote = to;
              } else {
                canPromote = to;
              }
            }
          } else {
            if (from.x < numRowsInSky || to.x < numRowsInSky) {
              if (fromSquare.type === "chick" && to.x === 0) {
                shouldPromote = to;
              } else {
                canPromote = to;
              }
            }
          }
        }
        // capture
        if (!toSquare.isEmpty) {
          const capturedType = getDemoted(toSquare.type);
          if (capturedType !== "lion") {
            newCaptured[fromSquare.isSky ? "sky" : "land"].push({
              type: capturedType,
              isSky: fromSquare.isSky,
            });
          } else {
            result.didEnd = true;
            result.didWin = true;
            result.didSkyWin = fromSquare.isSky;
          }
        }
        const newPieces = {
          board: newBoard,
          captured: newCaptured,
          shouldPromote,
          canPromote,
        };
        // king entering
        if (gameType === "micro") {
          if (!result.didEnd && fromSquare.type === "lion") {
            if (
              (fromSquare.isSky && to.x >= numRows - numRowsInSky) ||
              (!fromSquare.isSky && to.x < numRowsInSky)
            ) {
              if (!canBeCaptured(gameType, newPieces)(to)) {
                result.didEnd = true;
                result.didWin = true;
                result.didSkyWin = fromSquare.isSky;
              }
            }
          }
        }
        return {
          ...state,
          pieces: newPieces,
          isSkyTurn: !state.isSkyTurn,
          result,
        };
      }
      return state;
    }
    case "drop":
      const { isSky, fromIndex, to } = action.payload;
      const team = isSky ? "sky" : "land";
      const piece = state.pieces.captured[team][fromIndex];
      if (
        !state.result.didEnd &&
        canDrop(gameType, state.pieces)(isSky, fromIndex, to)
      ) {
        const newCaptured = {
          land: state.pieces.captured.land.slice(),
          sky: state.pieces.captured.sky.slice(),
        };
        newCaptured[team] = newCaptured[team].filter(
          (p, index) => index !== fromIndex
        );
        const newBoard = state.pieces.board.map((row, i) => {
          // irrelevent row: return as is
          if (i !== to.x) {
            return row;
          }
          return row.map((square, j) => {
            if (j === to.y) {
              return {
                type: piece.type,
                isSky: piece.isSky,
              };
            }
            return square;
          });
        });
        return {
          ...state,
          pieces: { board: newBoard, captured: newCaptured },
          isSkyTurn: !state.isSkyTurn,
        };
      }
      return state;
    case "promote":
      const { position } = action.payload;
      return {
        ...state,
        pieces: {
          ...state.pieces,
          shouldPromote: null,
          canPromote: null,
          board: state.pieces.board.map((row, i) => {
            if (i !== position.x) {
              return row;
            }
            return row.map((square, j) => {
              if (j !== position.y) {
                return square;
              }
              return {
                ...square,
                type: getPromoted(square.type),
              };
            });
          }),
        },
      };
    default:
      return state;
  }
};

function Game({ config, onHelp }) {
  const { gameType } = config;
  const initialState = {
    result: {
      didEnd: false,
      didWin: false,
      didSkyWin: false,
    },
    isSkyTurn: false,
    pieces: getInitialPieces(gameType),
  };
  const [{ pieces, isSkyTurn, result }, dispatch] = useReducer(
    piecesReducer(gameType),
    {
      initialState,
      ...initialState,
    }
  );
  const [resultClosed, setResultClosed] = useState(false);
  const { numRows, numCols } = getSettings(gameType);
  const numRowsInSky = Math.floor(numRows / 3);
  const animals = getAnimals(gameType);

  if (pieces.shouldPromote) {
    dispatch({ type: "promote", payload: { position: pieces.shouldPromote } });
  }

  // action creators
  const reset = () => {
    dispatch({ type: "reset" });
    setResultClosed(false);
  };
  const move = (from, to) => dispatch({ type: "move", payload: { from, to } });
  const drop = (isSky, from, to) =>
    dispatch({ type: "drop", payload: { isSky, fromIndex: from, to } });

  return (
    <DndProvider backend={Backend} options={HTML5toTouch}>
      <AnimalsContext.Provider value={animals}>
        <GameStateContext.Provider value={{ pieces, isSkyTurn, result }}>
          <GameDispatchContext.Provider
            value={{
              canMove: canMove(gameType, pieces),
              move,
              canDrop: canDrop(gameType, pieces),
              drop,
            }}
          >
            <Board
              numCols={numCols}
              numRows={numRows}
              numRowsInSky={numRowsInSky}
            />
            <div className={styles.iconButtonsContainer}>
              <IconButton icon={resetIcon} alt="reset" onClick={reset} />
              <IconButton
                className={styles.helpButton}
                text="?"
                onClick={onHelp}
              />
            </div>
            {!resultClosed && result.didEnd && (
              <Result
                didSkyWin={result.didSkyWin}
                onReset={reset}
                onClose={() => setResultClosed(true)}
              />
            )}
          </GameDispatchContext.Provider>
        </GameStateContext.Provider>
      </AnimalsContext.Provider>
    </DndProvider>
  );
}

Game.propTypes = {
  config: PropTypes.object,
  onHelp: PropTypes.func,
};

export default Game;
