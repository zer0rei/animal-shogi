import { evaluateMaterial, generateMoves, applyMove, findBestMove } from './shogiEngine';
import getInitialPieces from './components/Game/getInitialPieces';
import { getAnimals } from './components/Game/getAnimals';
import { getSettings } from './components/Game/getSettings';

// Mock getAnimals and getSettings to provide consistent data for tests
// This is a simplified mock. In a real scenario, you might need a more comprehensive one
// or ensure your test data aligns with the actual getAnimals/getSettings output.
jest.mock('./components/Game/getAnimals', () => ({
  getAnimals: jest.fn((gameType) => {
    if (gameType === 'micro') {
      return {
        lion: { moves: [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}, {x:1,y:1}, {x:1,y:-1}, {x:-1,y:1}, {x:-1,y:-1}], promotesTo: null },
        chick: { moves: [{x:0,y:1}], promotesTo: 'hen' },
        hen: { moves: [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}, {x:1,y:1}, {x:-1,y:1}], promotesTo: null }, // Simplified Hen
        cat: { moves: [{x:1,y:1}, {x:1,y:-1}, {x:-1,y:1}, {x:-1,y:-1}], promotesTo: 'dog' },
        dog: { moves: [{x:0,y:1}, {x:1,y:0}, {x:-1,y:0}, {x:0,y:-1}], promotesTo: null }, // Simplified Dog
        elephant: { moves: [{x:1,y:1}, {x:1,y:-1}, {x:-1,y:1}, {x:-1,y:-1}], promotesTo: null }, // Not used in micro, but for completeness
        giraffe: { moves: [{x:0,y:1}, {x:0,y:-1}, {x:1,y:0}, {x:-1,y:0}], promotesTo: null }, // Not used in micro
      };
    }
    // Add goro if needed
    return {};
  }),
}));

jest.mock('./components/Game/getSettings', () => ({
  getSettings: jest.fn((gameType) => {
    if (gameType === 'micro') {
      return { boardWidth: 3, boardHeight: 4, promotionRankSky: 3, promotionRankLand: 0 };
    }
    // Add goro if needed
    return {};
  }),
}));


// Piece values as defined in shogiEngine.js (or import if exported)
const PIECE_VALUES = {
  lion: 1000,
  chick: 1,
  hen: 3,
  elephant: 5,
  giraffe: 5,
  cat: 2,
  dog: 3,
};

describe('shogiEngine', () => {
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
      const board = getInitialPieces('micro').board; // Standard micro setup
      // Sky: L, G, E, C (1000 + 5 + 5 + 1 = 1011) - assuming G, E are placeholders in initial for micro
      // Land: l, g, e, c (1000 + 5 + 5 + 1 = 1011)
      // For actual micro: Sky: L,C at start; Land: L,C at start
      // Let's use the actual micro setup from getInitialPieces
      // Sky: Lion (0,1), Chick (1,1)
      // Land: Lion (3,1), Chick (2,1)
      const initialBoard = getInitialPieces('micro').board;
      const skyScore = PIECE_VALUES.lion + PIECE_VALUES.chick;
      const landScore = PIECE_VALUES.lion + PIECE_VALUES.chick;

      expect(evaluateMaterial(initialBoard, true)).toBe(skyScore - landScore); // Sky's turn
      expect(evaluateMaterial(initialBoard, false)).toBe(landScore - skyScore); // Land's turn
    });
  });

  describe('generateMoves', () => {
    const gameType = 'micro';
    let initialBoard;
    let capturedPieces;

    beforeEach(() => {
      const pieces = getInitialPieces(gameType);
      initialBoard = pieces.board;
      capturedPieces = pieces.captured;
       // Ensure mocks are called with the correct gameType
      getAnimals.mockClear();
      getSettings.mockClear();
      getAnimals(gameType); // To populate the mocked animals for 'micro'
      getSettings(gameType); // To populate the mocked settings for 'micro'
    });

    test('should generate moves for a Chick at starting position (Sky player)', () => {
      // Sky Chick at (1,1)
      const moves = generateMoves(initialBoard, true, gameType, capturedPieces);
      // Chick at (1,1) for Sky moves to (2,1) (y increases for Sky)
      const chickMoves = moves.filter(
        m => m.from?.x === 1 && m.from?.y === 1 && m.pieceType === 'chick'
      );
      expect(chickMoves).toContainEqual(
        expect.objectContaining({
          from: { x: 1, y: 1 },
          to: { x: 2, y: 1 }, // Sky moves from low index to high index for x in this representation
          pieceType: 'chick',
          promotion: false,
        })
      );
      // Check calls to mocks
      expect(getAnimals).toHaveBeenCalledWith(gameType);
      expect(getSettings).toHaveBeenCalledWith(gameType);
    });
    
    test('should generate promotion move for a Chick reaching promotion zone (Sky player)', () => {
      const board = deepCopyBoard(initialBoard);
      // Sky Chick at (2,1), one step from promotion. Sky's promotion zone is x=3 (last rank)
      board[1][1] = { isEmpty: true }; // Clear original chick
      board[2][1] = { type: 'Chick', isSky: true, isEmpty: false };

      const moves = generateMoves(board, true, gameType, capturedPieces);
      const chickPromotionMoves = moves.filter(
        m => m.from?.x === 2 && m.from?.y === 1 && m.pieceType === 'chick' && m.to.x === 3
      );
      
      expect(chickPromotionMoves).toContainEqual(
        expect.objectContaining({
          from: { x: 2, y: 1 },
          to: { x: 3, y: 1 },
          pieceType: 'chick',
          promotion: true,
          promotedTo: 'hen',
        })
      );
      // Should also include the non-promotion move
       expect(chickPromotionMoves).toContainEqual(
        expect.objectContaining({
          from: { x: 2, y: 1 },
          to: { x: 3, y: 1 },
          pieceType: 'chick',
          promotion: false,
        })
      );
    });

    test('should generate drop moves for captured pieces (Sky player)', () => {
      const board = deepCopyBoard(initialBoard);
      // Make a square empty for dropping
      board[1][0] = { isEmpty: true };
      const captured = {
        sky: [{ type: 'Chick', number: 1 }],
        land: [],
      };
      const moves = generateMoves(board, true, gameType, captured);
      const dropMoves = moves.filter(m => m.isDrop && m.pieceType === 'chick');
      
      // Expect a drop move for Chick to each empty square.
      // For this test, specifically check for the one we made empty: (1,0)
      expect(dropMoves).toContainEqual(
        expect.objectContaining({
          pieceType: 'chick',
          to: { x: 1, y: 0 },
          isDrop: true,
        })
      );
      // Count empty squares: 3*4 = 12. Initial pieces = 4. So 8 empty squares.
      expect(dropMoves.length).toBe(8); 
    });

    test('should return empty array if no moves are possible', () => {
      const board = [
        [{type: 'Lion', isSky: true, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}, {type: 'Giraffe', isSky: false, isEmpty: false}],
        [{type: 'Elephant', isSky: false, isEmpty: false}, {type: 'Chick', isSky: false, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}],
        [{type: 'Giraffe', isSky: false, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}],
        [{isEmpty:true}, {isEmpty:true}, {isEmpty:true}]
      ]; // Sky Lion surrounded by enemy pieces, no escape
      const captured = { sky: [], land: [] };
      const moves = generateMoves(board, true, gameType, captured);
      expect(moves).toEqual([]);
    });
  });

  describe('applyMove', () => {
    const gameType = 'micro';
    let board;
    let captured;

    beforeEach(() => {
      const pieces = getInitialPieces(gameType);
      board = pieces.board;
      captured = pieces.captured;
      getAnimals(gameType); 
      getSettings(gameType);
    });

    test('should apply a simple board move', () => {
      // Sky Chick at (1,1) moves to (2,1)
      const move = { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false };
      const { newBoard } = applyMove(board, move, true, captured, gameType);
      
      expect(newBoard[1][1].isEmpty).toBe(true);
      expect(newBoard[2][1]).toMatchObject({ type: 'Chick', isSky: true, isEmpty: false });
    });

    test('should apply a capture move and update captured pieces', () => {
      // Sky Chick at (1,1) captures Land Chick at (2,1)
      board[2][1] = { type: 'Chick', isSky: false, isEmpty: false }; // Place enemy chick
      const move = { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false, capturedPiece: 'chick' };
      
      const { newBoard, newCapturedPieces } = applyMove(board, move, true, captured, gameType);
      
      expect(newBoard[1][1].isEmpty).toBe(true);
      expect(newBoard[2][1]).toMatchObject({ type: 'Chick', isSky: true, isEmpty: false });
      expect(newCapturedPieces.sky).toEqual(expect.arrayContaining([
        expect.objectContaining({ type: 'chick', number: 1 }) 
      ]));
    });
    
    test('should apply a capture move and demote promoted piece (Hen to Chick)', () => {
      board[2][1] = { type: 'Hen', isSky: false, isEmpty: false }; // Land Hen
      const move = { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false, capturedPiece: 'hen' };
      const { newCapturedPieces } = applyMove(board, move, true, captured, gameType);
      
      const capturedChick = newCapturedPieces.sky.find(p => p.type === 'chick');
      expect(capturedChick).toBeDefined();
      expect(capturedChick.number).toBeGreaterThanOrEqual(1);
    });

    test('should apply a drop move', () => {
      const capturedWithChick = { sky: [{ type: 'chick', number: 1 }], land: [] };
      const move = { pieceType: 'chick', to: { x: 1, y: 0 }, isDrop: true }; // Drop chick to (1,0)
      board[1][0] = { isEmpty: true }; // Ensure target is empty

      const { newBoard, newCapturedPieces } = applyMove(board, move, true, capturedWithChick, gameType);
      
      expect(newBoard[1][0]).toMatchObject({ type: 'chick', isSky: true, isEmpty: false });
      const skyChickPile = newCapturedPieces.sky.find(p => p.type === 'chick');
      expect(skyChickPile ? skyChickPile.number : 0).toBe(0); // or piece removed if number was 1
    });

    test('should apply a promotion move', () => {
      // Sky Chick at (2,1) moves to (3,1) and promotes to Hen
      board[1][1] = {isEmpty: true}; // empty original chick
      board[2][1] = { type: 'Chick', isSky: true, isEmpty: false };
      const move = { from: { x: 2, y: 1 }, to: { x: 3, y: 1 }, pieceType: 'chick', promotion: true, promotedTo: 'hen' };
      
      const { newBoard } = applyMove(board, move, true, captured, gameType);
      
      expect(newBoard[2][1].isEmpty).toBe(true);
      expect(newBoard[3][1]).toMatchObject({ type: 'Hen', isSky: true, isEmpty: false });
    });
  });
  
  // findBestMove tests will be shallow for now
  describe('findBestMove (shallow)', () => {
    const gameType = 'micro';
    let board;
    let capturedPieces;

    beforeEach(() => {
        const pieces = getInitialPieces(gameType);
        board = pieces.board;
        capturedPieces = pieces.captured;
        getAnimals(gameType);
        getSettings(gameType);
    });

    test('should return a valid move object if moves are available', () => {
        // Standard initial setup for micro, Sky to move
        const bestMove = findBestMove(board, true, gameType, capturedPieces);
        // We expect findBestMove to call generateMoves and negamax.
        // Since negamax (at depth > 0) would recursively call generateMoves,
        // and applyMove, we are testing integration here.
        expect(bestMove).not.toBeNull();
        expect(bestMove).toHaveProperty('to');
        // Further checks depend on the move type (drop or board move)
        if (bestMove.isDrop) {
            expect(bestMove).toHaveProperty('pieceType');
        } else {
            expect(bestMove).toHaveProperty('from');
            expect(bestMove).toHaveProperty('pieceType');
        }
    });

    test('should pick an obvious capture (Lion captures Chick with SEARCH_DEPTH=1)', () => {
      const currentBoard = deepCopyBoard(board);
      // Sky Lion at (0,1), Land Chick at (1,1) right in front
      currentBoard[0][1] = { type: 'Lion', isSky: true, isEmpty: false };
      currentBoard[1][1] = { type: 'Chick', isSky: false, isEmpty: false }; // Land Chick
      // Clear other pieces for simplicity
      currentBoard[1][0] = {isEmpty: true}; currentBoard[0][0] = {isEmpty: true}; currentBoard[0][2] = {isEmpty: true};
      currentBoard[2][1] = {isEmpty: true}; currentBoard[3][1] = {isEmpty: true};


      // With SEARCH_DEPTH=1, negamax directly calls evaluateMaterial.
      // Capturing the chick should result in a higher score.
      const bestMove = findBestMove(currentBoard, true, gameType, { sky: [], land: [] });

      expect(bestMove).toMatchObject({
        from: { x: 0, y: 1 },
        to: { x: 1, y: 1 },
        pieceType: 'lion',
      });
    });
    
    test('should return null if no moves are possible', () => {
      const noMovesBoard = [
        [{type: 'Lion', isSky: true, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}, {type: 'Giraffe', isSky: false, isEmpty: false}],
        [{type: 'Elephant', isSky: false, isEmpty: false}, {type: 'Chick', isSky: false, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}],
        [{type: 'Giraffe', isSky: false, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}, {type: 'Elephant', isSky: false, isEmpty: false}],
        [{isEmpty:true}, {isEmpty:true}, {isEmpty:true}]
      ];
      const bestMove = findBestMove(noMovesBoard, true, gameType, { sky: [], land: [] });
      expect(bestMove).toBeNull();
    });
  });

});

// Helper for deep copying board for tests if not using lodash/cloneDeep
function deepCopyBoard(board) {
  return board.map(row => row.map(square => ({ ...square })));
}
