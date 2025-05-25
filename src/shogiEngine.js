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
  // console.log(`generateMoves called for: ${isSkyTurn ? 'Sky' : 'Land'}, gameType: ${gameType}`);
  // console.log("Board:", JSON.parse(JSON.stringify(board)));
  // console.log("Captured:", JSON.parse(JSON.stringify(capturedPieces)));

  const moves = [];
  const settings = getSettings(gameType);
  const animals = getAnimals(gameType); // Actual animals data from getAnimals.js
  const { boardWidth, boardHeight } = settings;

  // Promotion ranks: x is row index
  const promotionRankSky = boardHeight - 1; // Sky promotes when row index reaches max
  const promotionRankLand = 0;             // Land promotes when row index reaches 0

  // Board moves
  // r = row index (maps to 'x' in Game.js move objects)
  // c = column index (maps to 'y' in Game.js move objects)
  for (let r = 0; r < boardHeight; r++) {
    for (let c = 0; c < boardWidth; c++) {
      const square = board[r][c];
      if (!square.isEmpty && square.isSky === isSkyTurn) {
        const pieceType = square.type.toLowerCase();
        const pieceAnimalData = animals[pieceType]; // e.g., animals['chick']
        
        if (!pieceAnimalData) {
          // console.warn(`No animal data found for piece type: ${pieceType}`);
          continue;
        }

        const pieceMoves = pieceAnimalData.moves; // These are {x: dR, y: dC} from Sky's perspective
        const piecePromotesTo = pieceAnimalData.promotesTo;

        if (pieceMoves) {
          for (const moveDelta of pieceMoves) { // moveDelta is {x: dR, y: dC}
            // dR is change in row, dC is change in column
            // These deltas are from Sky's point of view (e.g., positive dR means "forward" for Sky towards higher row index)
            const dR = moveDelta.x;
            const dC = moveDelta.y;

            const targetR = r + (isSkyTurn ? dR : -dR);
            const targetC = c + (isSkyTurn ? dC : -dC);

            if (targetR >= 0 && targetR < boardHeight && targetC >= 0 && targetC < boardWidth) {
              const targetSquare = board[targetR][targetC];
              if (targetSquare.isEmpty || targetSquare.isSky !== isSkyTurn) {
                const baseMove = {
                  from: { x: r, y: c }, // Game.js convention: x=row, y=col
                  to: { x: targetR, y: targetC }, // Game.js convention: x=row, y=col
                  pieceType: pieceType,
                  capturedPiece: targetSquare.isEmpty ? null : targetSquare.type.toLowerCase(),
                  promotion: false
                };
                moves.push(baseMove);
                // console.log("Pushed move:", JSON.parse(JSON.stringify(baseMove)));


                const canPromote = piecePromotesTo !== null && piecePromotesTo !== undefined;
                // isAlreadyPromoted check is implicitly handled by canPromote:
                // e.g. if pieceType is 'hen', piecePromotesTo is null, so canPromote is false.
                
                // Check if the piece is in a position to promote based on its TO square
                const isInPromotionZone = isSkyTurn ? targetR === promotionRankSky : targetR === promotionRankLand;
                // Also check if it came FROM promotion zone (can't promote if already started in and moved within)
                // const wasInPromotionZone = isSkyTurn ? r === promotionRankSky : r === promotionRankLand;
                // Shogi rule: can promote if move STARTS or ENDS in promotion zone.
                // For simplicity here, we use if move ENDS in promotion zone.
                // More precise: (isSkyTurn ? (targetR === promotionRankSky || r === promotionRankSky) : (targetR === promotionRankLand || r === promotionRankLand))
                // For Dobutsu Shogi, it's simpler: just entering the last rank.

                if (canPromote && isInPromotionZone) {
                  moves.push({
                    ...baseMove,
                    promotion: true,
                    promotedTo: piecePromotesTo.toLowerCase()
                  });
                  // console.log("Pushed promotion move:", JSON.parse(JSON.stringify({...baseMove, promotion: true, promotedTo: piecePromotesTo.toLowerCase()})));
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
  if (playerCaptured) {
    for (const piece of playerCaptured) {
      if (piece.number > 0) {
        const pieceTypeToDrop = piece.type.toLowerCase();
        // Ensure piece type exists in animals definition (e.g. not 'promotedcat')
        if (!animals[pieceTypeToDrop] || animals[pieceTypeToDrop].promotesTo === undefined) {
             // console.warn(`Skipping drop of invalid or non-droppable piece type: ${pieceTypeToDrop}`);
             // This check is a bit loose. A demoted piece (like chick) should be droppable.
             // The main point is that 'hen' itself cannot be dropped. It's always 'chick' in hand.
        }

        for (let r_drop = 0; r_drop < boardHeight; r_drop++) {
          for (let c_drop = 0; c_drop < boardWidth; c_drop++) {
            if (board[r_drop][c_drop].isEmpty) {
              // Add additional drop rules here if necessary (e.g., Nifu for Chick)
              // For now, allowing drop on any empty square.
              const dropMove = {
                pieceType: pieceTypeToDrop,
                to: { x: r_drop, y: c_drop }, // Game.js convention: x=row, y=col
                isDrop: true,
              };
              moves.push(dropMove);
              // console.log("Pushed drop move:", JSON.parse(JSON.stringify(dropMove)));
            }
          }
        }
      }
    }
  }
  // console.log(`generateMoves returning ${moves.length} moves.`);
  return moves;
}


/**
 * Checks if the specified king is currently in check.
 * @param {Array<Array<Object>>} board - The current board state.
 * @param {boolean} kingIsSky - True if checking Sky's king, false for Land's king.
 * @param {string} gameType - 'micro' or 'goro'.
 * @param {Object} animalsData - Pre-loaded animals data from getAnimals(gameType).
 * @param {Object} settingsData - Pre-loaded settings data from getSettings(gameType).
 * @returns {boolean} True if the king is in check, false otherwise.
 */
function isKingInCheck(board, kingIsSky, gameType, animalsData, settingsData) {
  const { boardWidth, boardHeight } = settingsData;
  let kingPos = null;

  // 1. Find the king's position
  for (let r = 0; r < boardHeight; r++) {
    for (let c = 0; c < boardWidth; c++) {
      const square = board[r][c];
      if (!square.isEmpty && square.type.toLowerCase() === 'lion' && square.isSky === kingIsSky) {
        kingPos = { r, c };
        break;
      }
    }
    if (kingPos) break;
  }

  if (!kingPos) {
    // console.warn(`King not found for player: ${kingIsSky ? 'Sky' : 'Land'}. This might indicate a bug or a lost king.`);
    return false; // Or throw an error, depending on how game over by king capture is handled elsewhere
  }

  // 2. Check attacks from all opponent pieces
  const opponentIsSky = !kingIsSky;
  for (let r = 0; r < boardHeight; r++) {
    for (let c = 0; c < boardWidth; c++) {
      const square = board[r][c];
      if (!square.isEmpty && square.isSky === opponentIsSky) {
        const pieceType = square.type.toLowerCase();
        const pieceAnimalData = animalsData[pieceType];

        if (!pieceAnimalData || !pieceAnimalData.moves) continue;

        for (const moveDelta of pieceAnimalData.moves) {
          const dR = moveDelta.x; // Delta row from opponent's piece perspective
          const dC = moveDelta.y; // Delta col from opponent's piece perspective

          // Target calculation from opponent's perspective
          // If opponent is Sky, their dR means +row index if positive.
          // If opponent is Land, their dR means -row index if positive (relative to their "forward").
          // The moveDeltas from getAnimals are always from Sky's default perspective.
          // So, if opponentIsSky, use dR, dC directly.
          // If opponentIsLand, invert dR, dC.
          const targetR = r + (opponentIsSky ? dR : -dR);
          const targetC = c + (opponentIsSky ? dC : -dC);
          
          if (targetR === kingPos.r && targetC === kingPos.c) {
            // Check if path is clear (for non-jumping pieces - Lion, Chick, Hen can be assumed to not jump)
            // For simplicity, this check assumes pieces move directly. Shogi pieces generally don't jump over others.
            // A full line-of-sight check would be needed for pieces like Rooks/Bishops in standard Shogi.
            // console.log(`King at (${kingPos.r}, ${kingPos.c}) is in check from ${pieceType} at (${r}, ${c}) moving to (${targetR}, ${targetC})`);
            return true; 
          }
        }
      }
    }
  }
  return false;
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
    // move.from.x is row, move.from.y is col
    // move.to.x is row, move.to.y is col
    const piece = newBoard[move.from.x][move.from.y]; 
    const targetSquare = newBoard[move.to.x][move.to.y];

    if (!targetSquare.isEmpty) { // Capture
      const capturedTypeOnBoard = targetSquare.type.toLowerCase();
      
      // Determine the type of piece that goes into hand (demoted type)
      let typeForHand = capturedTypeOnBoard;
      // Check all animal types in 'animals' to find if 'capturedTypeOnBoard' is a promoted form
      for (const baseAnimalName in animals) {
        if (animals[baseAnimalName].promotesTo?.toLowerCase() === capturedTypeOnBoard) {
          typeForHand = baseAnimalName.toLowerCase();
          break;
        }
      }

      const destPile = isSkyTurn ? newCapturedPieces.sky : newCapturedPieces.land;
      let foundInPile = destPile.find(p => p.type.toLowerCase() === typeForHand);
      if (foundInPile) {
        foundInPile.number++;
      } else {
        destPile.push({ type: typeForHand, number: 1 });
      }
    }

    newBoard[move.to.x][move.to.y] = { // Use x for row, y for col
      ...piece,
      type: move.promotion ? move.promotedTo.toLowerCase() : piece.type.toLowerCase(),
    };
    newBoard[move.from.x][move.from.y] = { isEmpty: true }; // Use x for row, y for col
  }
  return { newBoard, newCapturedPieces };
}


const WIN_SCORE = 10000; // A large score for winning (checkmate)
const LOSS_SCORE = -10000; // A large score for losing

function negamax(board, depth, alpha, beta, isSkyTurn, gameType, capturedPieces, animalsData, settingsData) {
  if (depth === 0) {
    return evaluateMaterial(board, isSkyTurn);
  }

  let legalMoves = [];
  const pseudoLegalMoves = generateMoves(board, isSkyTurn, gameType, capturedPieces);

  for (const move of pseudoLegalMoves) {
    const { newBoard } = applyMove(board, move, isSkyTurn, capturedPieces, gameType);
    // Check if the move leaves the current player's king in check
    if (!isKingInCheck(newBoard, isSkyTurn, gameType, animalsData, settingsData)) {
      legalMoves.push(move);
    }
  }

  if (legalMoves.length === 0) {
    // No legal moves
    if (isKingInCheck(board, isSkyTurn, gameType, animalsData, settingsData)) {
      // console.log(`${isSkyTurn ? 'Sky' : 'Land'} is checkmated.`);
      return LOSS_SCORE + depth; // Penalize faster checkmates less to encourage prolonging game if losing
    } else {
      // console.log(`${isSkyTurn ? 'Sky' : 'Land'} is stalemated.`);
      return 0; // Stalemate
    }
  }

  let maxScore = -Infinity; // Start with a very low score

  for (const move of legalMoves) {
    const { newBoard, newCapturedPieces } = applyMove(board, move, isSkyTurn, capturedPieces, gameType);
    const score = -negamax(newBoard, depth - 1, -beta, -alpha, !isSkyTurn, gameType, newCapturedPieces, animalsData, settingsData);

    if (score > maxScore) {
      maxScore = score;
    }
    if (score > alpha) {
      alpha = score;
    }
    if (alpha >= beta) {
      break; 
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
 * @returns {Object} The best move found, or null if no moves are possible (checkmate/stalemate).
 */
function findBestMove(initialBoard, isSkyTurn, gameType, initialCapturedPieces) {
  const animalsData = getAnimals(gameType);
  const settingsData = getSettings(gameType);

  let bestMove = null;
  let bestScore = -Infinity; // Correctly -Infinity for maximizing player
  let alpha = -Infinity;
  let beta = Infinity;

  const pseudoLegalMoves = generateMoves(initialBoard, isSkyTurn, gameType, initialCapturedPieces);
  let legalMoves = [];

  for (const move of pseudoLegalMoves) {
    const { newBoard } = applyMove(initialBoard, move, isSkyTurn, initialCapturedPieces, gameType);
    if (!isKingInCheck(newBoard, isSkyTurn, gameType, animalsData, settingsData)) {
      legalMoves.push(move);
    }
  }
  
  if (legalMoves.length === 0) {
    // console.log(`No legal moves for ${isSkyTurn ? 'Sky' : 'Land'} in findBestMove.`);
    // This state (checkmate or stalemate) will be determined by negamax score if called,
    // or can be checked here directly. Game.js will also perform this check.
    return null; // No move to make
  }

  // Sort moves (optional, for better alpha-beta pruning)
  // Example: legalMoves.sort((a,b) => /* some heuristic for move ordering */);

  for (const move of legalMoves) {
    const { newBoard, newCapturedPieces } = applyMove(initialBoard, move, isSkyTurn, initialCapturedPieces, gameType);
    // Score from opponent's perspective, so negate it.
    const score = -negamax(newBoard, SEARCH_DEPTH - 1, -beta, -alpha, !isSkyTurn, gameType, newCapturedPieces, animalsData, settingsData);

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
    if (score > alpha) {
      alpha = score;
    }
    // No beta cutoff at the root, we want the actual best move.
    // Pruning happens within the negamax calls.
  }

  // console.log("Best move found by AI:", bestMove, "with score:", bestScore);
  return bestMove;
}

// Export the main function
export { findBestMove, evaluateMaterial, generateMoves, applyMove, negamax, isKingInCheck }; // also exporting helpers
console.log("shogiEngine.js loaded with Negamax, move generation, and check detection.");
