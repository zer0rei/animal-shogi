import React, { useReducer, useState } from "react";
import cloneDeep from "lodash.clonedeep";
import PropTypes from "prop-types";
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


const isSquareAttacked = (gameType, board, targetPos, targetOwnerIsSky) => {
  const animals = getAnimals(gameType);

  for (let r = 0; r < board.length; r++) {
    for (let c = 0; c < board[0].length; c++) {
      const attackerSquare = board[r][c];
      if (!attackerSquare.isEmpty && attackerSquare.isSky !== targetOwnerIsSky) {
        const attackerMoves = animals[attackerSquare.type]?.moves;
        if (attackerMoves) {
          for (const move of attackerMoves) {
            // Check if this move, from {x:r, y:c} to targetPos, is valid
            // validateDestination(board, from, to, move)
            // validateDestination needs fromPiece which is attackerSquare
            // It also needs to know if the move is a step ('s') or multi-step ('m')
            // The moves from getAnimals are already expanded (e.g. "stm", "sbl")
            
            // Reconstruct from, to for validateDestination
            // const from = { x: r, y: c }; // Not strictly needed for this simplified check
            
            // Simplified validation for attack check:
            // Does move pattern from (r,c) land on targetPos?
            const xPositionsMap = { t: -1, m: 0, b: 1 };
            const yPositionsMap = { l: -1, m: 0, r: 1 };

            let destX = r;
            let destY = c;

            // Assuming moves are single step 's' like "stm", "sbl" from expandMoves
            if (move[0] === 's') {
                destX += (attackerSquare.isSky ? -1 : 1) * xPositionsMap[move[1]];
                destY += (attackerSquare.isSky ? -1 : 1) * yPositionsMap[move[2]];

                if (targetPos.x === destX && targetPos.y === destY) {
                    // Now, ensure the path isn't blocked IF it's a ranged move (not applicable here as moves are single step)
                    // And ensure it's not attacking its own piece (already checked by attackerSquare.isSky !== targetOwnerIsSky)
                    return true; // Target position is attacked
                }
            }
            // If other move types like 'm' (multi-step) were present, more complex check needed
          }
        }
      }
    }
  }
  return false;
};

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

const canDrop = (gameType, pieces) => (isSky, fromIndex, to) => {
  if (!pieces.board[to.x][to.y].isEmpty) {
    return false;
  }

  // Nifu (Two Pawns) rule for 'chick'
  if (gameType !== "micro") { 
    const pieceToDrop = pieces.captured[isSky ? "sky" : "land"][fromIndex];
    if (pieceToDrop.type === "chick") {
      const { numRows } = getSettings(gameType); 
      for (let i = 0; i < numRows; i++) {
        const square = pieces.board[i][to.y]; 
        // Check if square is not empty, is a chick, belongs to the current player,
        // and is not promoted (isPromoted is not available here, assume type 'chick' means unpromoted)
        if (!square.isEmpty && square.type === "chick" && square.isSky === isSky) {
          return false;
        }
      }
    }
  }
  return true;
};

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
        moveHistory: [],
        result: { ...state.initialState.result, isDraw: false }, 
      };
    }
    case "move": {
      const { numRows } = getSettings(gameType);
      const numRowsInSky = Math.floor(numRows / 3);
      const { from, to } = action.payload;
      if (!state.result.didEnd && canMove(gameType, state.pieces)(from, to)) {
        let canPromote = null;
        let shouldPromote = null;
        const newCaptured = cloneDeep(state.pieces.captured);
        const result = {
          didEnd: false,
          didWin: false,
          didSkyWin: false,
          isDraw: false,
        };
        const fromSquare = state.pieces.board[from.x][from.y];
        const toSquare = state.pieces.board[to.x][to.y];
        const newBoard = state.pieces.board.map((row, i) => {
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
          const numRowsInSky = Math.floor(numRows / 3);
          const numPromotionRows = gameType === "micro" ? 1 : 2;
          if (fromSquare.isSky) {
            if (from.x >= numRows - numRowsInSky || to.x >= numRows - numRowsInSky) {
              if (["chick", "cat"].includes(fromSquare.type) && to.x >= numRows - numPromotionRows) {
                shouldPromote = to;
              } else if (["chick", "cat"].includes(fromSquare.type)) { 
                canPromote = to;
              }
            }
          } else { 
            if (from.x < numRowsInSky || to.x < numRowsInSky) {
              if (["chick", "cat"].includes(fromSquare.type) && to.x < numPromotionRows) {
                shouldPromote = to;
              } else if (["chick", "cat"].includes(fromSquare.type)) { 
                canPromote = to;
              }
            }
          }
        }
        // capture
        if (!toSquare.isEmpty) {
          const capturedType = getDemoted(toSquare.type);
          if (capturedType !== "lion") {
            const teamCaptured = newCaptured[fromSquare.isSky ? "sky" : "land"];
            const capturedPiece = teamCaptured.find(
              ({ type }) => type === capturedType
            );
            if (capturedPiece) {
              capturedPiece.number += 1;
            } else {
              teamCaptured.push({
                type: capturedType,
                isSky: fromSquare.isSky,
                number: 1,
              });
            }
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

        // Four-move repetition check (Sennichite)
        // Should be checked only if the game hasn't already ended by capture or king entering
        let finalMoveHistory = state.moveHistory || [];
        if (!result.didEnd) {
          const currentStateKey = JSON.stringify(newPieces.board) + (!state.isSkyTurn).toString();
          finalMoveHistory = [...(state.moveHistory || []), currentStateKey];
          
          let repetitionCount = 0;
          for (const historyKey of finalMoveHistory) {
            if (historyKey === currentStateKey) {
              repetitionCount++;
            }
          }

          if (repetitionCount >= 4) {
            result.didEnd = true;
            result.didWin = false; 
            result.isDraw = true;
          }
        }
        
        return {
          ...state,
          pieces: newPieces,
          isSkyTurn: !state.isSkyTurn,
          result,
          moveHistory: finalMoveHistory, 
        };
      }
      return state;
    }
    case "drop": {
      const { isSky, fromIndex, to } = action.payload;
      const team = isSky ? "sky" : "land";
      const pieceToDrop = state.pieces.captured[team][fromIndex];
      if (
        !state.result.didEnd &&
        canDrop(gameType, state.pieces)(isSky, fromIndex, to)
      ) {
        const newCaptured = cloneDeep(state.pieces.captured);
        const capturedPiece = newCaptured[team][fromIndex];
        if (capturedPiece.number > 1) {
          capturedPiece.number -= 1;
        } else {
          newCaptured[team] = newCaptured[team].filter(
            (p, index) => index !== fromIndex
          );
        }
        const newBoard = state.pieces.board.map((row, i) => {
          if (i !== to.x) {
            return row;
          }
          return row.map((square, j) => {
            if (j === to.y) {
              return {
                type: pieceToDrop.type, 
                isSky: pieceToDrop.isSky, 
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
    }
    case "promote": {
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
    }
    default:
      return state;
  }
};

function Game({ config, onHelp, onConfigChange }) { 
  const { gameType } = config; 
  const initialState = {
    result: {
      didEnd: false,
      didWin: false,
      didSkyWin: false,
      isDraw: false,
    },
    isSkyTurn: false,
    pieces: getInitialPieces(gameType),
    moveHistory: [],
  };
  const [{ pieces, isSkyTurn, result, moveHistory }, dispatch] = useReducer(
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

  const nextGameType = gameType === "micro" ? "goro" : "micro";
  const nextGameTypeLabel = nextGameType === "micro" ? "S" : "M";
  const nextGameTypeAria = nextGameType === "micro" ? "Switch to 3x4 game" : "Switch to 5x6 game";

  return (
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
            <IconButton icon={resetIcon} ariaLabel="replay" onClick={reset} />
            <IconButton
              className={styles.helpButton}
              text="?"
              ariaLabel="help"
              onClick={onHelp}
            />
            <IconButton
              text={nextGameTypeLabel}
              ariaLabel={nextGameTypeAria}
              onClick={() => onConfigChange({ gameType: nextGameType })}
            />
          </div>
          {!resultClosed && result.didEnd && (
            <Result
              didSkyWin={result.didSkyWin}
              isDraw={result.isDraw}
              onReset={reset}
              onClose={() => setResultClosed(true)}
            />
          )}
        </GameDispatchContext.Provider>
      </GameStateContext.Provider>
    </AnimalsContext.Provider>
  );
}

Game.propTypes = {
  config: PropTypes.object,
  onHelp: PropTypes.func,
  onConfigChange: PropTypes.func,
};

export default Game;
