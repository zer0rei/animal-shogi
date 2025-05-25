// Piece values
const PIECE_VALUES = {
  lion: 1000,
  chick: 1,
  hen: 3, // promoted Chick
  elephant: 5,
  giraffe: 5,
  cat: 2,
  dog: 3, // promoted Cat
  // Assuming 'sky' and 'land' are the two players
  // We'll handle player perspective in the evaluation function
};

import { getAnimals } from './components/Game/getAnimals.js';
import { getSettings } from './components/Game/getSettings.js';

// Search depth
const SEARCH_DEPTH = 3;

// Helper function to get piece value (handles cases where piece might be null or undefined)
function getPieceValue(piece) {
  if (!piece || !piece.type) {
    return 0;
  }
  return PIECE_VALUES[piece.type.toLowerCase()] || 0;
}

/**
 * Evaluates the material balance of the board.
 * @param {Array<Array<Object>>} board - The current board state.
 * @param {boolean} isSkyTurn - Whose turn it is.
 * @returns {number} The score from the perspective of the current player.
 */
function evaluateMaterial(board, isSkyTurn) {
  let score = 0;
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const square = board[y][x];
      if (!square.isEmpty) {
        const pieceValue = getPieceValue(square);
        if (square.isSky) {
          score += pieceValue;
        } else {
          score -= pieceValue;
        }
      }
    }
  }
  return isSkyTurn ? score : -score;
}

/**
 * Generates all possible moves for the current player.
 * @param {Array<Array<Object>>} board - The current board state.
 * @param {boolean} isSkyTurn - Whose turn it is.
 * @param {string} gameType - 'micro' or 'goro'.
 * @param {{sky: Array<Object>, land: Array<Object>}} capturedPieces - Captured pieces.
 * @returns {Array<Object>} A list of possible move objects.
 */
function generateMoves(board, isSkyTurn, gameType, capturedPieces) {
  const moves = [];
  const settings = getSettings(gameType);
  const animals = getAnimals(gameType);
  const { boardWidth, boardHeight } = settings;

  // Determine promotion zone
  // For 'micro' (3x4): last rank (y=0 for land, y=3 for sky)
  // For 'goro' (5x6): assuming last two ranks (y=0,1 for land; y=4,5 for sky)
  // TODO: Confirm promotion zone for 'goro' if it's different. For now, using last rank for simplicity.
  const promotionRankSky = boardHeight - 1;
  const promotionRankLand = 0;


  // Board moves
  for (let y = 0; y < boardHeight; y++) {
    for (let x = 0; x < boardWidth; x++) {
      const square = board[y][x];
      if (!square.isEmpty && square.isSky === isSkyTurn) {
        const pieceType = square.type.toLowerCase();
        const pieceMoves = animals[pieceType]?.moves;
        const piecePromotesTo = animals[pieceType]?.promotesTo;

        if (pieceMoves) {
          for (const move of pieceMoves) {
            let newX = x + (isSkyTurn ? move.x : -move.x); // Adjust x based on player
            let newY = y + (isSkyTurn ? move.y : -move.y); // Adjust y based on player

            if (newX >= 0 && newX < boardWidth && newY >= 0 && newY < boardHeight) {
              const targetSquare = board[newY][newX];
              if (targetSquare.isEmpty || targetSquare.isSky !== isSkyTurn) {
                // Valid move (empty or enemy piece)
                const baseMove = {
                  from: { x, y },
                  to: { x: newX, y: newY },
                  pieceType: pieceType,
                  capturedPiece: targetSquare.isEmpty ? null : targetSquare.type,
                  promotion: false
                };
                moves.push(baseMove);

                // Handle promotion
                const canPromote = piecePromotesTo !== null && piecePromotesTo !== undefined;
                const isInPromotionZone = isSkyTurn ? newY === promotionRankSky : newY === promotionRankLand;
                const isAlreadyPromoted = pieceType === animals[pieceType.replace('promoted', '')]?.promotesTo; // e.g. 'hen' is promoted 'chick'

                if (canPromote && !isAlreadyPromoted && isInPromotionZone) {
                   // If it's a piece that *can* promote (like chick to hen)
                   // And it's entering the promotion zone
                   // And it's not already promoted
                  moves.push({
                    ...baseMove,
                    promotion: true,
                    promotedTo: piecePromotesTo
                  });
                }
              }
            }
          }
        }
      }
    }
  }

  // Drop moves
  const playerCaptured = isSkyTurn ? capturedPieces.sky : capturedPieces.land;
  for (const piece of playerCaptured) {
    if (piece.number > 0) {
      // Check if this piece type can be dropped (all basic pieces can)
      // For now, assume all captured pieces can be dropped.
      // Advanced rules like two pawns in a column are not handled yet.
      for (let y = 0; y < boardHeight; y++) {
        for (let x = 0; x < boardWidth; x++) {
          if (board[y][x].isEmpty) {
            moves.push({
              pieceType: piece.type.toLowerCase(), // Ensure consistent casing
              to: { x, y },
              isDrop: true,
            });
          }
        }
      }
    }
  }
  return moves;
}

// --- Negamax Algorithm with Alpha-Beta Pruning ---

/**
 * Deep copies the board state.
 * @param {Array<Array<Object>>} board - The board to copy.
 * @returns {Array<Array<Object>>} A deep copy of the board.
 */
function deepCopyBoard(board) {
  return board.map(row => row.map(square => ({ ...square })));
}

/**
 * Deep copies captured pieces.
 * @param {{sky: Array<Object>, land: Array<Object>}} captured - Captured pieces object.
 * @returns {{sky: Array<Object>, land: Array<Object>}} A deep copy.
 */
function deepCopyCapturedPieces(captured) {
  return {
    sky: captured.sky.map(p => ({ ...p })),
    land: captured.land.map(p => ({ ...p })),
  };
}

/**
 * Applies a move to a copy of the board and captured pieces.
 * @param {Array<Array<Object>>} board - The current board state.
 * @param {Object} move - The move to apply.
 * @param {boolean} isSkyTurn - Whose turn it is.
 * @param {{sky: Array<Object>, land: Array<Object>}} capturedPieces - Current captured pieces.
 * @param {string} gameType - 'micro' or 'goro'.
 * @returns {{newBoard: Array<Array<Object>>, newCapturedPieces: {sky: Array<Object>, land: Array<Object>}}}
 */
function applyMove(board, move, isSkyTurn, capturedPieces, gameType) {
  const newBoard = deepCopyBoard(board);
  const newCapturedPieces = deepCopyCapturedPieces(capturedPieces);
  const animals = getAnimals(gameType);

  if (move.isDrop) {
    newBoard[move.to.y][move.to.x] = {
      type: move.pieceType,
      isSky: isSkyTurn,
      isEmpty: false,
    };
    const sourcePile = isSkyTurn ? newCapturedPieces.sky : newCapturedPieces.land;
    const pieceInPile = sourcePile.find(p => p.type.toLowerCase() === move.pieceType.toLowerCase());
    if (pieceInPile) {
      pieceInPile.number--;
    }
  } else {
    const piece = newBoard[move.from.y][move.from.x];
    const targetSquare = newBoard[move.to.y][move.to.x];

    if (!targetSquare.isEmpty) { // Capture
      const capturedType = targetSquare.type.toLowerCase();
      // demote if necessary (e.g., captured 'hen' becomes 'chick' in hand)
      let originalPieceType = capturedType;
      for (const animalName in animals) {
        if (animals[animalName].promotesTo === capturedType) {
          originalPieceType = animalName;
          break;
        }
      }

      const destPile = isSkyTurn ? newCapturedPieces.sky : newCapturedPieces.land;
      let foundInPile = destPile.find(p => p.type.toLowerCase() === originalPieceType);
      if (foundInPile) {
        foundInPile.number++;
      } else {
        destPile.push({ type: originalPieceType, number: 1 });
      }
    }

    newBoard[move.to.y][move.to.x] = {
      ...piece,
      type: move.promotion ? move.promotedTo : piece.type,
    };
    newBoard[move.from.y][move.from.x] = { isEmpty: true };
  }
  return { newBoard, newCapturedPieces };
}


function negamax(board, depth, alpha, beta, isSkyTurn, gameType, capturedPieces) {
  if (depth === 0) {
    return evaluateMaterial(board, isSkyTurn);
  }

  let maxScore = -Infinity;
  const possibleMoves = generateMoves(board, isSkyTurn, gameType, capturedPieces);

  if (possibleMoves.length === 0) { // No legal moves
    // This could be stalemate or checkmate.
    // For simplicity, evaluate the current board. A more advanced engine would detect checkmate.
    return evaluateMaterial(board, isSkyTurn);
  }

  for (const move of possibleMoves) {
    const { newBoard, newCapturedPieces } = applyMove(board, move, isSkyTurn, capturedPieces, gameType);
    const score = -negamax(newBoard, depth - 1, -beta, -alpha, !isSkyTurn, gameType, newCapturedPieces);

    if (score > maxScore) {
      maxScore = score;
    }
    if (score > alpha) {
      alpha = score;
    }
    if (alpha >= beta) {
      break; // Beta cutoff
    }
  }
  return maxScore;
}

/**
 * Main function to find the best move using Negamax with Alpha-Beta Pruning.
 * @param {Array<Array<Object>>} board - The current board state.
 * @param {boolean} isSkyTurn - Whose turn it is.
 * @param {string} gameType - 'micro' or 'goro'.
 * @param {{sky: Array<Object>, land: Array<Object>}} capturedPieces - Captured pieces.
 * @returns {Object} The best move found, or null if no moves are possible.
 */
function findBestMove(initialBoard, isSkyTurn, gameType, initialCapturedPieces) {
  let bestMove = null;
  let bestScore = -Infinity;
  let alpha = -Infinity;
  let beta = Infinity;

  const possibleMoves = generateMoves(initialBoard, isSkyTurn, gameType, initialCapturedPieces);

  if (possibleMoves.length === 0) {
    console.log("No moves available.");
    return null;
  }
  
  // Sort moves to try more promising ones first (e.g., captures, promotions)
  // This can improve alpha-beta pruning effectiveness. Not implemented here for simplicity.

  for (const move of possibleMoves) {
    const { newBoard, newCapturedPieces } = applyMove(initialBoard, move, isSkyTurn, initialCapturedPieces, gameType);
    const score = -negamax(newBoard, SEARCH_DEPTH - 1, -beta, -alpha, !isSkyTurn, gameType, newCapturedPieces);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    if (score > alpha) {
      alpha = score;
    }
     // Note: The top-level alpha check against beta is not strictly necessary here,
     // as we want to find the actual best move, not just a score.
     // Pruning happens inside the recursive negamax calls.
  }

  console.log("Best move found:", bestMove, "with score:", bestScore);
  return bestMove;
}

// Export the main function
export { findBestMove, evaluateMaterial, generateMoves, applyMove, negamax }; // also exporting helpers for potential testing
console.log("shogiEngine.js loaded with Negamax and move generation.");
