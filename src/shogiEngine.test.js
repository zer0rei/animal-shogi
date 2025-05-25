import { evaluateMaterial, generateMoves, applyMove, findBestMove } from './shogiEngine';
import getInitialPieces from './components/Game/getInitialPieces';
import { getAnimals } from './components/Game/getAnimals';
import { getSettings } from './components/Game/getSettings';

import { isKingInCheck, negamax } from './shogiEngine'; // Import new functions

// Mock getAnimals and getSettings to provide consistent data for tests
// For shogiEngine tests, we want to control the animal moves precisely.
// Sky moves from row 0 to 3. Land moves from row 3 to 0.
// A positive x in a move delta means "forward" for Sky (increasing row index).
const mockMicroAnimals = {
  lion: { moves: [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}, {x:1,y:1}, {x:1,y:-1}, {x:-1,y:1}, {x:-1,y:-1}], promotesTo: null },
  chick: { moves: [{x:1,y:0}], promotesTo: 'hen' }, // Sky Chick moves +1 in row index
  hen: { moves: [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}, {x:1,y:1}, {x:-1,y:1}], promotesTo: null }, // Gold General moves (forward, sides, back-forward diagonals, back-middle)
  // For testing isKingInCheck with more piece types:
  cat: { moves: [{x:1,y:1}, {x:1,y:-1}, {x:-1,y:1}, {x:-1,y:-1}], promotesTo: 'dog' }, // Hypothetical cat moves
  dog: { moves: [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}], promotesTo: null }, // Hypothetical dog moves
  elephant: { moves: [{x:1,y:1}, {x:1,y:-1}, {x:-1,y:1}, {x:-1,y:-1}, {x:0,y:0}] /* no move for simplicity in some tests */, promotesTo: null },
  giraffe: { moves: [{x:1,y:0}, {x:-1,y:0}, {x:0,y:1}, {x:0,y:-1}, {x:0,y:0}] /* no move for simplicity */, promotesTo: null },
};

const mockMicroSettings = { boardWidth: 3, boardHeight: 4 };


jest.mock('./components/Game/getAnimals', () => ({
  getAnimals: jest.fn((gameType) => {
    if (gameType === 'micro') {
      return mockMicroAnimals;
    }
    return {}; // Default for other game types if any
  }),
}));

jest.mock('./components/Game/getSettings', () => ({
  getSettings: jest.fn((gameType) => {
    if (gameType === 'micro') {
      return mockMicroSettings;
    }
    return {}; // Default for other game types if any
  }),
}));


// Piece values and scores as defined in shogiEngine.js
const PIECE_VALUES = {
  lion: 1000,
  chick: 1,
  hen: 3,
  elephant: 5, // Keep even if not in standard micro, for test flexibility
  giraffe: 5,  // Keep even if not in standard micro
  cat: 2,      // Keep for test flexibility
  dog: 3,      // Keep for test flexibility
};
const WIN_SCORE = 10000;
const LOSS_SCORE = -10000;
const SEARCH_DEPTH_FOR_TEST = 2; // Or 1 for simpler tests, 3 for deeper ones if fast enough


describe('shogiEngine', () => {
  // Pre-fetch for functions that need them passed in
  const animalsDataMicro = mockMicroAnimals;
  const settingsDataMicro = mockMicroSettings;

  describe('evaluateMaterial', () => {
    test('should return 0 for an empty board', () => {
      const board = getInitialPieces('micro').board.map(row =>
        row.map(() => ({ isEmpty: true }))
      );
      expect(evaluateMaterial(board, true)).toBe(0);
      expect(evaluateMaterial(board, false)).toBe(0);
    });

    test('should correctly evaluate a simple board', () => {
      const board = getInitialPieces('micro').board.map(row =>
        row.map(() => ({ isEmpty: true }))
      );
      // Sky has a Lion, Land has a Chick
      board[0][1] = { type: 'Lion', isSky: true, isEmpty: false };   // Sky Lion
      board[3][1] = { type: 'Chick', isSky: false, isEmpty: false }; // Land Chick

      // Sky's perspective: 1000 - 1 = 999
      expect(evaluateMaterial(board, true)).toBe(PIECE_VALUES.lion - PIECE_VALUES.chick);
      // Land's perspective: 1 - 1000 = -999
      expect(evaluateMaterial(board, false)).toBe(PIECE_VALUES.chick - PIECE_VALUES.lion);
    });

    test('should evaluate a more complex board', () => {
      // Standard micro setup: Sky Lion (0,1), Chick (1,1); Land Lion (3,1), Chick (2,1)
      const initialBoard = getInitialPieces('micro').board; 
      // Sky's perspective: (Lion + Chick) - (Lion + Chick) = 0
      expect(evaluateMaterial(initialBoard, true)).toBe(0);
      // Land's perspective: (Lion + Chick) - (Lion + Chick) = 0
      expect(evaluateMaterial(initialBoard, false)).toBe(0);
    });
  });

  describe('generateMoves (Post-Fix Validation)', () => {
    const gameType = 'micro';
    let board; // Use simple board states for specific tests
    const emptyCaptured = { sky: [], land: [] };

    beforeEach(() => {
      // Reset mocks, though they return static values here
      getAnimals.mockClear();
      getSettings.mockClear();
    });

    test('should use {x: row, y: col} and Sky Chick forward is +x', () => {
      board = getInitialPieces(gameType).board; // Sky Chick at (1,1)
      const moves = generateMoves(board, true, gameType, emptyCaptured);
      const chickMove = moves.find(m => m.pieceType === 'chick' && m.from.x === 1 && m.from.y === 1);
      expect(chickMove).toBeDefined();
      expect(chickMove.to).toEqual({ x: 2, y: 1 }); // Chick moves from row 1 to row 2
    });
    
    test('Land Chick forward is -x', () => {
      board = getInitialPieces(gameType).board; // Land Chick at (2,1)
      const moves = generateMoves(board, false, gameType, emptyCaptured);
      const chickMove = moves.find(m => m.pieceType === 'chick' && m.from.x === 2 && m.from.y === 1);
      expect(chickMove).toBeDefined();
      expect(chickMove.to).toEqual({ x: 1, y: 1 }); // Land Chick moves from row 2 to row 1
    });

    test('Lion moves from center', () => {
      board = createEmptyBoard();
      board[1][1] = { type: 'Lion', isSky: true, isEmpty: false };
      const moves = generateMoves(board, true, gameType, emptyCaptured);
      // Lion at (1,1) can move to 8 squares: (0,0),(0,1),(0,2), (1,0),(1,2), (2,0),(2,1),(2,2)
      expect(moves.length).toBe(8);
      expect(moves).toContainEqual(expect.objectContaining({ from: {x:1,y:1}, to: {x:0,y:0} }));
      expect(moves).toContainEqual(expect.objectContaining({ from: {x:1,y:1}, to: {x:2,y:2} }));
    });
    
    test('Lion at edge of board (0,0)', () => {
      board = createEmptyBoard();
      board[0][0] = { type: 'Lion', isSky: true, isEmpty: false }; // Sky Lion at (0,0)
      const moves = generateMoves(board, true, gameType, emptyCaptured);
      // Moves to (0,1), (1,0), (1,1)
      expect(moves.length).toBe(3);
      expect(moves).toContainEqual(expect.objectContaining({ from: {x:0,y:0}, to: {x:0,y:1} }));
      expect(moves).toContainEqual(expect.objectContaining({ from: {x:0,y:0}, to: {x:1,y:0} }));
      expect(moves).toContainEqual(expect.objectContaining({ from: {x:0,y:0}, to: {x:1,y:1} }));
    });

    test('Promotion for Sky Chick at (2,1) to (3,1)', () => {
      board = createEmptyBoard();
      board[2][1] = { type: 'Chick', isSky: true, isEmpty: false }; // Sky Chick one step from promotion
      const moves = generateMoves(board, true, gameType, emptyCaptured);
      const promotionMove = moves.find(m => m.promotion === true);
      expect(promotionMove).toBeDefined();
      expect(promotionMove).toMatchObject({ from: {x:2,y:1}, to: {x:3,y:1}, pieceType: 'chick', promotedTo: 'hen' });
      // Should also include non-promoting move
      const nonPromotingMove = moves.find(m => m.promotion === false && m.to.x === 3 && m.to.y ===1);
      expect(nonPromotingMove).toBeDefined();
    });
    
    test('No promotion for Hen', () => {
        board = createEmptyBoard();
        board[2][1] = { type: 'Hen', isSky: true, isEmpty: false };
        const moves = generateMoves(board, true, gameType, emptyCaptured);
        const henMoveToLastRank = moves.find(m => m.to.x === 3); // Move hen to promotion rank
        expect(henMoveToLastRank).toBeDefined();
        expect(henMoveToLastRank.promotion).toBe(false); // Hen cannot promote further
    });

    test('Drop moves for Sky with captured Chick', () => {
      board = createEmptyBoard(); // Completely empty board
      const captured = { sky: [{ type: 'chick', number: 1 }], land: [] };
      const moves = generateMoves(board, true, gameType, captured);
      // 3*4 = 12 empty squares
      expect(moves.length).toBe(12);
      expect(moves.every(m => m.isDrop && m.pieceType === 'chick')).toBe(true);
      expect(moves).toContainEqual(expect.objectContaining({ pieceType: 'chick', to: {x:0,y:0}, isDrop: true }));
    });
  });

  describe('isKingInCheck', () => {
    const gameType = 'micro';
    let board;

    test('Sky King in direct check by Land Chick', () => {
      board = createEmptyBoard();
      board[0][1] = { type: 'Lion', isSky: true, isEmpty: false };   // Sky Lion
      board[1][1] = { type: 'Chick', isSky: false, isEmpty: false }; // Land Chick directly ahead
      expect(isKingInCheck(board, true, gameType, animalsDataMicro, settingsDataMicro)).toBe(true);
    });

    test('Sky King not in check (initial board)', () => {
      board = getInitialPieces(gameType).board;
      expect(isKingInCheck(board, true, gameType, animalsDataMicro, settingsDataMicro)).toBe(false);
    });
    
    test('Land King in direct check by Sky Chick', () => {
      board = createEmptyBoard();
      board[3][1] = { type: 'Lion', isSky: false, isEmpty: false };  // Land Lion
      board[2][1] = { type: 'Chick', isSky: true, isEmpty: false }; // Sky Chick directly ahead
      expect(isKingInCheck(board, false, gameType, animalsDataMicro, settingsDataMicro)).toBe(true);
    });

    test('King on edge in check', () => {
      board = createEmptyBoard();
      board[0][0] = { type: 'Lion', isSky: true, isEmpty: false };   // Sky Lion
      board[1][0] = { type: 'Chick', isSky: false, isEmpty: false }; // Land Chick
      expect(isKingInCheck(board, true, gameType, animalsDataMicro, settingsDataMicro)).toBe(true);
    });
    
    test('No king on board, should not throw error and return false', () => {
        board = createEmptyBoard(); // No kings
        expect(isKingInCheck(board, true, gameType, animalsDataMicro, settingsDataMicro)).toBe(false);
    });
  });


  describe('applyMove', () => { // Assuming applyMove uses x:row, y:col from previous fixes
    const gameType = 'micro';
    let board; // Use simple board states
    let captured;

    beforeEach(() => {
      board = getInitialPieces(gameType).board; // Standard micro board
      captured = { sky: [], land: [] }; // Start with no captured pieces
      // Mocks are cleared in describe('generateMoves') or globally if needed
    });

    test('should apply a simple board move (Sky Chick (1,1) to (2,1))', () => {
      const move = { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false };
      const { newBoard } = applyMove(board, move, true, captured, gameType);
      expect(newBoard[1][1].isEmpty).toBe(true);
      expect(newBoard[2][1]).toMatchObject({ type: 'chick', isSky: true, isEmpty: false });
    });

    test('should apply a capture move (Sky Lion (0,1) captures Land Chick (1,1))', () => {
      board[0][1] = {type: 'Lion', isSky: true, isEmpty: false};
      board[1][1] = {type: 'Chick', isSky: false, isEmpty: false}; // Land's chick
      const move = { from: { x: 0, y: 1 }, to: { x: 1, y: 1 }, pieceType: 'lion', capturedPiece: 'chick', promotion: false };
      const { newBoard, newCapturedPieces } = applyMove(board, move, true, captured, gameType);
      
      expect(newBoard[0][1].isEmpty).toBe(true);
      expect(newBoard[1][1]).toMatchObject({ type: 'lion', isSky: true, isEmpty: false });
      expect(newCapturedPieces.sky).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'chick', number: 1 })
      ]));
    });
    
    test('should demote captured promoted piece (Sky captures Land Hen, gets Chick)', () => {
      board[0][1] = {type: 'Lion', isSky: true, isEmpty: false}; // Sky Lion
      board[1][1] = {type: 'Hen', isSky: false, isEmpty: false}; // Land Hen
      const move = { from: {x:0,y:1}, to: {x:1,y:1}, pieceType: 'lion', capturedPiece: 'hen', promotion: false};
      const { newCapturedPieces } = applyMove(board, move, true, captured, gameType);
      
      const capturedChick = newCapturedPieces.sky.find(p => p.type === 'chick');
      expect(capturedChick).toBeDefined();
      expect(capturedChick.number).toBe(1);
    });

    test('should apply a drop move (Sky drops Chick to (0,0))', () => {
      board[0][0] = { isEmpty: true };
      captured = { sky: [{ type: 'chick', number: 1 }], land: [] };
      const move = { pieceType: 'chick', to: { x: 0, y: 0 }, isDrop: true };
      const { newBoard, newCapturedPieces } = applyMove(board, move, true, captured, gameType);
      
      expect(newBoard[0][0]).toMatchObject({ type: 'chick', isSky: true, isEmpty: false });
      const skyChickPile = newCapturedPieces.sky.find(p => p.type === 'chick');
      expect(skyChickPile ? skyChickPile.number : 0).toBe(0);
    });

    test('should apply a promotion move (Sky Chick (2,1) to (3,1) promotes to Hen)', () => {
      board[2][1] = { type: 'Chick', isSky: true, isEmpty: false };
      board[1][1] = {isEmpty: true}; // Clear original chick spot if it was there
      const move = { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, pieceType: 'chick', promotion: true, promotedTo: 'hen' };
      const { newBoard } = applyMove(board, move, true, captured, gameType);
      
      expect(newBoard[2][1].isEmpty).toBe(true);
      expect(newBoard[3][1]).toMatchObject({ type: 'hen', isSky: true, isEmpty: false });
    });
  });
  
  describe('findBestMove / negamax (Checkmate/Stalemate/Self-Check)', () => {
    const gameType = 'micro';
    let board;
    const emptyCaptured = { sky: [], land: [] };

    test('Checkmate: Sky King has no moves and is in check -> findBestMove returns null', () => {
      board = createEmptyBoard();
      board[0][0] = { type: 'Lion', isSky: true, isEmpty: false };   // Sky King
      board[1][0] = { type: 'Chick', isSky: false, isEmpty: false }; // Land Chick attacking King
      board[0][1] = { type: 'Hen', isSky: false, isEmpty: false };   // Land Hen blocking escape
      board[1][1] = { type: 'Hen', isSky: false, isEmpty: false };   // Land Hen blocking escape
      
      // Verify king is in check first
      expect(isKingInCheck(board, true, gameType, animalsDataMicro, settingsDataMicro)).toBe(true);
      const bestMove = findBestMove(board, true, gameType, emptyCaptured);
      expect(bestMove).toBeNull();
    });

    test('Checkmate: Sky King checkmated -> negamax returns LOSS_SCORE + depth', () => {
      board = createEmptyBoard();
      board[0][0] = { type: 'Lion', isSky: true, isEmpty: false }; 
      board[1][0] = { type: 'Chick', isSky: false, isEmpty: false }; 
      board[0][1] = { type: 'Hen', isSky: false, isEmpty: false };   
      board[1][1] = { type: 'Hen', isSky: false, isEmpty: false };  
      
      const score = negamax(board, SEARCH_DEPTH_FOR_TEST, -Infinity, Infinity, true, gameType, emptyCaptured, animalsDataMicro, settingsDataMicro);
      expect(score).toBe(LOSS_SCORE + SEARCH_DEPTH_FOR_TEST);
    });

    test('Stalemate: Sky King has no moves but not in check -> findBestMove returns null', () => {
      board = createEmptyBoard();
      board[0][0] = { type: 'Lion', isSky: true, isEmpty: false };   // Sky King
      // Block all king's moves with non-attacking friendly or non-checking enemy pieces
      board[1][0] = { type: 'Lion', isSky: false, isEmpty: false }; // Land Lion (blocks, but doesn't check if it can't move there)
      board[0][1] = { type: 'Lion', isSky: false, isEmpty: false }; 
      board[1][1] = { type: 'Lion', isSky: false, isEmpty: false }; 
      // Make sure the blocking Land Lions cannot themselves move to attack the King from their spots
      // For this test, assume lions cannot attack from these positions.
      
      expect(isKingInCheck(board, true, gameType, animalsDataMicro, settingsDataMicro)).toBe(false);
      const bestMove = findBestMove(board, true, gameType, emptyCaptured);
      expect(bestMove).toBeNull();
    });
    
    test('Stalemate: Sky King stalemated -> negamax returns 0', () => {
      board = createEmptyBoard();
      board[0][0] = { type: 'Lion', isSky: true, isEmpty: false };   
      board[1][0] = { type: 'Elephant', isSky: false, isEmpty: false }; // Use Elephant that has no moves in mock
      board[0][1] = { type: 'Elephant', isSky: false, isEmpty: false }; 
      board[1][1] = { type: 'Elephant', isSky: false, isEmpty: false }; 
      
      const score = negamax(board, SEARCH_DEPTH_FOR_TEST, -Infinity, Infinity, true, gameType, emptyCaptured, animalsDataMicro, settingsDataMicro);
      expect(score).toBe(0); // Stalemate score
    });

    test('Self-check prevention: Sky Chick cannot move if it exposes King to check', () => {
      board = createEmptyBoard();
      board[0][1] = { type: 'Lion', isSky: true, isEmpty: false };    // Sky King
      board[1][1] = { type: 'Chick', isSky: true, isEmpty: false };   // Sky Chick (blocking)
      board[2][1] = { type: 'Hen', isSky: false, isEmpty: false };   // Land Hen attacking along the column if Chick moves
      
      // Chick's only move is to (2,1), capturing the Hen. But this would expose King at (0,1) to hypothetical attack.
      // Let's assume Hen attacks like a rook for this test along col 1.
      // The current mock Hen does not do that. Let's adjust mock for this test or use a different attacker.
      // Let's use a Land Lion that would check if Chick moves.
      board[2][1] = { type: 'Lion', isSky: false, isEmpty: false }; // Land Lion

      // To make this scenario work, the Land Lion must be able to attack (0,1) if Chick moves from (1,1).
      // This setup is tricky. Let's simplify: if Chick moves from (1,1) to (2,1), the King at (0,1) is now open.
      // If there's a Land piece that can attack (0,1) only once (1,1) is empty, that's a self-check.
      // For example, Land Lion at (0,2) that can move to (0,1).
      board[0][2] = {type: 'Lion', isSky: false, isEmpty: false}; // Land Lion that can attack (0,1)
      
      // Sky Chick at (1,1) wants to move to (2,1). Sky King at (0,1).
      // If Chick moves, Lion at (0,2) can take King at (0,1).
      // This means the Chick move (1,1)->(2,1) is illegal.
      // So, findBestMove should not return this move.
      // If this is the only piece Sky can move, findBestMove should return null (or another move if available).

      const bestMove = findBestMove(board, true, gameType, emptyCaptured);
      const chickMove = bestMove ? (bestMove.from?.x === 1 && bestMove.from?.y === 1) : false;
      expect(chickMove).toBe(false); // Chick should not be able to move into self-check
    });
  });
});

// Helper for deep copying board for tests
function deepCopyBoard(board) {
  return board.map(row => row.map(square => ({ ...square })));
}

// Helper to create an empty board
function createEmptyBoard() {
  const board = [];
  for (let i = 0; i < mockMicroSettings.boardHeight; i++) {
    board.push(Array(mockMicroSettings.boardWidth).fill(null).map(() => ({ isEmpty: true })));
  }
  return board;
}
