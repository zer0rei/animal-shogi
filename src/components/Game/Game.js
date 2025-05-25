import React, { useReducer, useState, useEffect } from "react";
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
import { findBestMove, isKingInCheck as isKingInCheckEngine } from "../../shogiEngine.js"; // AI Engine
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

// Renamed to baseCanMove to avoid conflict with the context value
const baseCanMove = (gameType, pieces) => (from, to) => {
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

// Renamed to baseCanDrop to avoid conflict with the context value
const baseCanDrop = (gameType, pieces) => (isSky, fromIndex, to) => {
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
        let nextPlayerIsSkyTurn = !state.isSkyTurn;

        if (!result.didEnd) { // Only check repetition if game not already ended by other means
          const currentStateKey = JSON.stringify(newPieces.board) + nextPlayerIsSkyTurn.toString();
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
            result.isDraw = true; // Sennichite - draw
          }
        }

        // Check for Checkmate/Stalemate for the NEXT player, only if game not ended by other rules
        if (!result.didEnd) {
          const animalsData = getAnimals(gameType);
          const settingsData = getSettings(gameType);
          const noLegalMovesForNextPlayer = findBestMove(newPieces.board, nextPlayerIsSkyTurn, gameType, newPieces.captured) === null;

          if (noLegalMovesForNextPlayer) {
            result.didEnd = true;
            if (isKingInCheckEngine(newPieces.board, nextPlayerIsSkyTurn, gameType, animalsData, settingsData)) {
              // Checkmate: current player (state.isSkyTurn) wins
              result.didWin = true;
              result.didSkyWin = state.isSkyTurn;
              result.isDraw = false;
            } else {
              // Stalemate
              result.didWin = false;
              result.isDraw = true;
            }
          }
        }
        
        return {
          ...state,
          pieces: newPieces,
          isSkyTurn: nextPlayerIsSkyTurn,
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

        // Uchifu-dzume (Pawn drop checkmate) simplified: disallow chick drop causing check
        // The existing isSquareAttacked check attempts to prevent illegal chick drops.
        // If a chick drop is illegal due to Uchifu-dzume, this should prevent the state change.
        if (gameType !== "micro") {
          if (pieceToDrop.type === "chick") {
            let opponentsLionPosition = null;
            const { numRows, numCols } = getSettings(gameType);
            for (let r_idx = 0; r_idx < numRows; r_idx++) {
              for (let c_idx = 0; c_idx < numCols; c_idx++) {
                if (newBoard[r_idx][c_idx].type === "lion" && newBoard[r_idx][c_idx].isSky === !isSky) {
                  opponentsLionPosition = { x: r_idx, y: c_idx };
                  break;
                }
              }
              if (opponentsLionPosition) break;
            }

            if (opponentsLionPosition) {
              if (isSquareAttacked(gameType, newBoard, opponentsLionPosition, !isSky)) {
                // This drop is potentially Uchifu-dzume (illegal move)
                return state; 
              }
            }
          }
        }

        const result = { ...state.result }; // Start with current result state
        let nextPlayerIsSkyTurn = !state.isSkyTurn;
        let finalMoveHistory = state.moveHistory || [];

        // Four-move repetition check (Sennichite)
        if (!result.didEnd) {
          const currentStateKey = JSON.stringify(newBoard) + nextPlayerIsSkyTurn.toString();
          finalMoveHistory = [...(state.moveHistory || []), currentStateKey];
          let repetitionCount = 0;
          for (const historyKey of finalMoveHistory) {
            if (historyKey === currentStateKey) repetitionCount++;
          }
          if (repetitionCount >= 4) {
            result.didEnd = true;
            result.didWin = false;
            result.isDraw = true; // Sennichite - draw
          }
        }
        
        // Check for Checkmate/Stalemate for the NEXT player, only if game not ended by other rules
        if (!result.didEnd) {
            const animalsData = getAnimals(gameType);
            const settingsData = getSettings(gameType);
            // Note: using newCaptured (which is the new state of captured pieces after the drop)
            const noLegalMovesForNextPlayer = findBestMove(newBoard, nextPlayerIsSkyTurn, gameType, newCaptured) === null;

            if (noLegalMovesForNextPlayer) {
                result.didEnd = true;
                if (isKingInCheckEngine(newBoard, nextPlayerIsSkyTurn, gameType, animalsData, settingsData)) {
                    // Checkmate: current player (state.isSkyTurn who made the drop) wins
                    result.didWin = true;
                    result.didSkyWin = state.isSkyTurn; 
                    result.isDraw = false;
                } else {
                    // Stalemate
                    result.didWin = false;
                    result.isDraw = true;
                }
            }
        }
        
        return {
          ...state,
          pieces: { board: newBoard, captured: newCaptured },
          isSkyTurn: nextPlayerIsSkyTurn,
          result, // Contains updated didEnd, didWin, etc.
          moveHistory: finalMoveHistory,
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
  const [aiModeActive, setAiModeActive] = useState(false); // AI mode state
  const [aiPlayerIsSky, setAiPlayerIsSky] = useState(true);   // AI plays as Sky by default

  const { numRows, numCols } = getSettings(gameType);
  const numRowsInSky = Math.floor(numRows / 3);
  const animals = getAnimals(gameType);

  // AI Logic
  useEffect(() => {
    if (aiModeActive && isSkyTurn === aiPlayerIsSky && !result.didEnd) {
      const timeoutId = setTimeout(() => {
        console.log("AI is thinking...");
        const bestMove = findBestMove(
          pieces.board,
          aiPlayerIsSky,
          gameType,
          pieces.captured
        );

        if (bestMove) {
          console.log("AI Move:", bestMove);
          if (bestMove.isDrop) {
            const teamCaptured = aiPlayerIsSky ? pieces.captured.sky : pieces.captured.land;
            const fromIndex = teamCaptured.findIndex(
              (p) => p.type.toLowerCase() === bestMove.pieceType.toLowerCase() && p.number > 0
            );
            if (fromIndex !== -1) {
              dispatch({
                type: "drop",
                payload: {
                  isSky: aiPlayerIsSky,
                  fromIndex: fromIndex,
                  to: bestMove.to,
                },
              });
            } else {
              console.error("AI wants to drop a piece it doesn't have:", bestMove.pieceType);
            }
          } else {
            dispatch({
              type: "move",
              payload: { from: bestMove.from, to: bestMove.to },
            });
          }
        } else {
          console.log("AI has no moves.");
        }
      }, 500); // 0.5 second delay for AI move

      return () => clearTimeout(timeoutId);
    }
  }, [isSkyTurn, aiModeActive, result.didEnd, pieces, gameType, aiPlayerIsSky, dispatch]);


  if (pieces.shouldPromote) {
    dispatch({ type: "promote", payload: { position: pieces.shouldPromote } });
  }

  // action creators
  const reset = () => {
    dispatch({ type: "reset" });
    setResultClosed(false);
    // setAiModeActive(false); // Optionally reset AI mode on game reset
  };
  // Renamed dispatch actions to avoid conflict if original canMove/canDrop were component methods
  const dispatchMove = (from, to) => dispatch({ type: "move", payload: { from, to } });
  const dispatchDrop = (isSky, from, to) =>
    dispatch({ type: "drop", payload: { isSky, fromIndex: from, to } });

  const toggleAiMode = () => {
    setAiModeActive(prevMode => !prevMode);
    // Optional: Reset game or AI player assignment if needed when toggling
    // For now, just toggling active state. AI will play as aiPlayerIsSky when its turn.
  };

  const nextGameType = gameType === "micro" ? "goro" : "micro";
  const nextGameTypeLabel = nextGameType === "micro" ? "S" : "M";
  const nextGameTypeAria = nextGameType === "micro" ? "Switch to 3x4 game" : "Switch to 5x6 game";

  const isPlayerTurnBlocked = aiModeActive && isSkyTurn === aiPlayerIsSky;

  // Wrapped canMove and canDrop for context
  const currentCanMove = (from, to) => {
    if (isPlayerTurnBlocked) return false;
    return baseCanMove(gameType, pieces)(from, to);
  };

  const currentCanDrop = (isSky, fromIndex, to) => {
    if (isPlayerTurnBlocked) return false;
    // Prevent human from dropping AI's pieces even if some logic error made it seem possible
    // This checks if the human is trying to drop a piece for the side the AI controls.
    if (aiModeActive && isSky === aiPlayerIsSky) return false; 
    return baseCanDrop(gameType, pieces)(isSky, fromIndex, to);
  };

  return (
    <AnimalsContext.Provider value={animals}>
      <GameStateContext.Provider value={{ pieces, isSkyTurn, result, aiModeActive, aiPlayerIsSky }}>
        <GameDispatchContext.Provider
          value={{
            canMove: currentCanMove,
            move: dispatchMove,
            canDrop: currentCanDrop,
            drop: dispatchDrop,
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
            <IconButton
              text={aiModeActive ? "A" : "P"}
              ariaLabel="Toggle AI mode"
              onClick={toggleAiMode}
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
