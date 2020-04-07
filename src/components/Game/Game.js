import React, { useReducer } from "react";
import PropTypes from "prop-types";
import { DndProvider } from "react-dnd";
import Backend from "react-dnd-multi-backend";
import HTML5toTouch from "react-dnd-multi-backend/dist/esm/HTML5toTouch";
import Board from "../Board";
import {
  PiecesStateContext,
  PiecesDispatchContext,
  AnimalsContext,
} from "../../contexts";
import { expandMoves } from "../../helpers";
import getSettings from "./getSettings";
import getAnimals from "./getAnimals";
import getInitialPieces from "./getInitialPieces";

const canMove = () => () => true;

const piecesReducer = (state, action) => {
  switch (action.type) {
    case "move": {
      const { from, to } = action.payload;
      if (canMove(state)(from, to)) {
        const newCaptured = state.captured.slice();
        const newBoard = state.board.map((row, i) => {
          // irrelevent row: return as is
          if (i !== from.x && i !== to.x) {
            return row;
          }
          return row.map((piece, j) => {
            if (i === from.x && j === from.y) {
              return {
                isEmpty: true,
              };
            }
            if (i === to.x && j === to.y) {
              if (!piece.isEmpty) {
                newCaptured.push({
                  type: piece.type,
                  isSky: !piece.isSky,
                });
              }
              const fromSquare = state.board[from.x][from.y];
              return {
                ...fromSquare,
                isEmpty: false,
              };
            }
            return piece;
          });
        });
        return { ...state, board: newBoard, captured: newCaptured };
      }
      return state;
    }
    case "drop":
      return {};
    case "promote":
      return {};
    default:
      return state;
  }
};

function Game({ config }) {
  const { gameType } = config;
  const [pieces, dispatch] = useReducer(
    piecesReducer,
    getInitialPieces(gameType)
  );
  const { numRows, numCols } = getSettings(gameType);
  const numRowsInSky = Math.floor(numRows / 3);
  const animals = getAnimals(gameType);
  // expand moves
  const returnedAnimals = {};
  Object.keys(animals).forEach((animal) => {
    returnedAnimals[animal] = {
      ...animals[animal],
      moves: expandMoves(animals[animal].moves),
    };
  });
  const move = (from, to) => dispatch({ type: "move", payload: { from, to } });

  return (
    <DndProvider backend={Backend} options={HTML5toTouch}>
      <AnimalsContext.Provider value={returnedAnimals}>
        <PiecesStateContext.Provider value={pieces}>
          <PiecesDispatchContext.Provider value={{ canMove, move }}>
            <Board
              numCols={numCols}
              numRows={numRows}
              numRowsInSky={numRowsInSky}
            />
          </PiecesDispatchContext.Provider>
        </PiecesStateContext.Provider>
      </AnimalsContext.Provider>
    </DndProvider>
  );
}

Game.propTypes = {
  config: PropTypes.object,
};

export default Game;
