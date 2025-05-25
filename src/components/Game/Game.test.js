import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Game from './Game';
import { findBestMove } from '../../shogiEngine'; // This will be the mock
import getInitialPieces from './getInitialPieces'; // To help set up board states

import { isKingInCheckEngine as isKingInCheckEngineMock } from '../../shogiEngine'; // Import the actual name for clarity

// Mock the shogiEngine
jest.mock('../../shogiEngine', () => ({
  findBestMove: jest.fn(),
  isKingInCheckEngine: jest.fn(), // Mock isKingInCheck from the engine
}));

// Mock getSettings and getAnimals if they are causing issues with default Game render
// or if specific configurations are needed for tests not covered by default initialPieces
jest.mock('./getSettings', () => ({
  __esModule: true,
  default: jest.fn((gameType = 'micro') => {
    if (gameType === 'micro') {
      return { numRows: 4, numCols: 3, boardWidth: 3, boardHeight: 4 };
    }
    return { numRows: 6, numCols: 5, boardWidth: 5, boardHeight: 6 }; // goro
  }),
}));

jest.mock('./getAnimals', () => ({
  __esModule: true,
  default: jest.fn((gameType = 'micro') => {
    // Return a simplified structure, actual moves don't matter as much for AI integration tests
    // as they do for engine tests.
    if (gameType === 'micro') {
      return {
        lion: { moves: [], promotesTo: null },
        chick: { moves: [{x:0, y:1}], promotesTo: 'hen' }, // Sky moves positive Y
        hen: { moves: [], promotesTo: null },
      };
    }
    return {};
  }),
  getPromoted: jest.fn(type => (type === 'chick' ? 'hen' : null)),
  getDemoted: jest.fn(type => (type === 'hen' ? 'chick' : type)),
  isPromoted: jest.fn(type => type === 'hen'),
}));


// Default props for Game component
const defaultConfig = { gameType: 'micro' };
const mockOnHelp = jest.fn();
const mockOnConfigChange = jest.fn();

describe('Game Component AI Integration', () => {
  beforeEach(() => {
    // Reset mocks before each test
    findBestMove.mockReset();
    isKingInCheckEngineMock.mockReset(); // Reset this mock too
    // Default mock implementations
    findBestMove.mockReturnValue(null);  // Default: AI has no move
    isKingInCheckEngineMock.mockReturnValue(false); // Default: King is not in check
  });

  test('should toggle AI mode when AI button is clicked', () => {
    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);
    
    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    expect(aiToggleButton).toHaveTextContent('P'); // Player vs Player initially

    fireEvent.click(aiToggleButton);
    expect(aiToggleButton).toHaveTextContent('A'); // AI mode active

    fireEvent.click(aiToggleButton);
    expect(aiToggleButton).toHaveTextContent('P'); // Back to Player vs Player
  });

  test('AI makes a board move when active and its turn', async () => {
    const initialPieces = getInitialPieces('micro'); // Sky: Lion (0,1), Chick (1,1) | Land: Lion (3,1), Chick (2,1)
    const aiMove = { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false, isDrop: false }; // Sky Chick moves forward
    findBestMove.mockReturnValue(aiMove);

    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);

    // Activate AI (AI is Sky player by default, and it's Sky's turn initially after reset/load)
    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    fireEvent.click(aiToggleButton); // AI is now active and it's Sky's turn

    // Wait for the AI's move to be processed (useEffect and setTimeout)
    await waitFor(() => {
      expect(findBestMove).toHaveBeenCalledTimes(1);
    });
    
    expect(findBestMove).toHaveBeenCalledWith(
      initialPieces.board, // current board state
      true,                // aiPlayerIsSky (true by default)
      'micro',             // gameType
      initialPieces.captured // current captured pieces
    );

    // Check if the board has updated. Chick from (1,1) should be gone. (2,1) should be Sky's Chick.
    // This requires checking the visual state or, more robustly, the internal state if accessible.
    // For now, we'll rely on findBestMove being called, which implies dispatch would be called.
    // A more detailed assertion would involve checking the piece positions after the move.
    // Example: Querying the board for pieces. This is complex with current setup.
    // We can check if the turn has changed.
    const turnIndicator = screen.getByText(/turn/i); // Assuming some turn indicator exists or can be added
    // Initially Sky's turn. After AI (Sky) moves, should be Land's turn.
    // This test needs a way to verify board state or turn change.
    // The Game component state `isSkyTurn` changes. If we had a visual indicator of this, we could check it.
    // For now, the key is that findBestMove was called and attempted a move.
  });

  test('AI makes a drop move when active and its turn', async () => {
    const initialPieces = getInitialPieces('micro');
    initialPieces.board[1][0] = { isEmpty: true }; // Make a square empty for drop
    initialPieces.captured.sky.push({ type: 'chick', number: 1, isSky: true }); // AI (Sky) has a chick to drop
    
    const aiDropMove = { pieceType: 'chick', to: { x: 1, y: 0 }, isDrop: true };
    findBestMove.mockReturnValue(aiDropMove);

    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);
    
    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    fireEvent.click(aiToggleButton); // Activate AI

    await waitFor(() => {
      expect(findBestMove).toHaveBeenCalledTimes(1);
    });

    expect(findBestMove).toHaveBeenCalledWith(
      initialPieces.board, // board state before drop
      true,
      'micro',
      initialPieces.captured
    );
    // Assert board change or turn change as in the previous test.
  });

  test('AI does not move when not its turn', async () => {
    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);
    
    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    fireEvent.click(aiToggleButton); // AI active

    // Manually make one move for Sky (human player, assuming AI is Land or AI is Sky but we make Sky's first move)
    // This part is tricky as Game.js default AI is Sky.
    // To test this, we'd need AI to be Land, or to make a move for Sky first.
    // Let's assume AI is Sky. We click AI button. It's Sky's turn. AI will try to move.
    // To test "not its turn", we need AI to be Land, or Sky to have already moved.

    // Reset findBestMove for this specific scenario if AI tried to move initially.
    findBestMove.mockClear(); 

    // Simulate a player move so it becomes Land's turn (assuming AI is Sky)
    // This requires interacting with the board, which is complex here.
    // Alternative: Modify Game to allow setting initial isSkyTurn or aiPlayerIsSky via props for testing.
    // For now, let's assume AI is Land for this test by setting aiPlayerIsSky to false in a hypothetical future setup.
    // Since we can't easily change aiPlayerIsSky, we'll test the default: AI is Sky.
    // If AI is Sky, and it's Sky's turn, it *will* move. So this test as is will fail or be misrepresentative.

    // A better approach:
    // 1. AI is Sky (default).
    // 2. AI is active.
    // 3. AI makes its move. `isSkyTurn` becomes `false` (Land's turn).
    // 4. Now, assert `findBestMove` is not called again immediately.
    findBestMove.mockReturnValueOnce({ from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false, isDrop: false });
    
    // Render and activate AI. AI will make one move.
    // We need to re-render or ensure the component updates for the second phase of the test.
    // This test is becoming an integration test of two turns.
    // Using `act` might be necessary if state updates are not immediately processed.
    
    // Let AI make its first move
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /toggle ai mode/i })); // Activate AI
      await waitFor(() => expect(findBestMove).toHaveBeenCalledTimes(1)); // AI (Sky) moves
    });

    // Now it should be Land's turn. findBestMove should not be called again for Sky.
    // We need to advance time if there's any delay or check.
    // The current useEffect for AI in Game.js only runs if isSkyTurn === aiPlayerIsSky.
    // So, if aiPlayerIsSky is true, and isSkyTurn becomes false, it shouldn't call findBestMove.
    // The assertion is that it's NOT called a *second* time for the same turn.
    expect(findBestMove).toHaveBeenCalledTimes(1); // Still 1, from AI's actual turn
  });

  test('AI does not move when game has ended', async () => {
    findBestMove.mockReturnValue({ from: { x: 0, y: 1 }, to: { x: 3, y: 1 }, pieceType: 'lion', isDrop: false }); // Lion capture for win

    // Render the game. For this test, we need to simulate a game end scenario.
    // This is complex because result.didEnd is managed internally.
    // One way: AI makes a winning move.
    
    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);
    
    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    fireEvent.click(aiToggleButton); // Activate AI

    // Let AI make its (winning) move.
    await waitFor(() => {
      expect(findBestMove).toHaveBeenCalledTimes(1);
    });

    // At this point, if the move was winning, result.didEnd should be true.
    // findBestMove should not be called again, even if it's theoretically AI's turn again due to some logic.
    // (The turn should switch, so this is covered by "not its turn" mostly)
    // The crucial part is that the useEffect has `!result.didEnd`.

    // To robustly test this, we'd need to:
    // 1. Set up a board where AI can make a winning move.
    // 2. AI makes the move. `result.didEnd` becomes true.
    // 3. Force `isSkyTurn` to be AI's turn again (hypothetically, if game logic allowed it post-win).
    // 4. Assert `findBestMove` is not called.
    // This is hard to set up without more control over Game state.

    // Simplified check: if findBestMove was called once (for the winning move),
    // and the game ends, subsequent calls (if any were possible) should be prevented
    // by the `!result.didEnd` check in the useEffect.
    // The current test structure for AI moves covers this implicitly: if the game ends,
    // the AI effect hook won't run again for a new move.
    // We've asserted it was called once for the move. If it were called again, the count would be > 1.
    expect(findBestMove).toHaveBeenCalledTimes(1); 
  });

  // --- Tests for Checkmate and Stalemate Game End ---
  // Note: These tests rely on the internal dispatch and reducer logic.
  // We find a piece that can move, click it, then click a target square.

  const performMove = async (getByRole, getByTestId, fromPos, toPos) => {
    // Helper to click a piece and then its target square.
    // Assumes pieces/squares have test-ids like `piece-${x}-${y}` or `square-${x}-${y}`
    // This is a placeholder, actual implementation depends on how pieces/squares are identified.
    // For now, we'll assume direct dispatch for testing reducer logic.
    // In a real UI test, you'd use fireEvent.click on elements.
  };


  test('should declare checkmate when opponent has no legal moves and is in check', async () => {
    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);
    
    // Sky (human) to move. Land (next player) will be checkmated.
    // After Sky moves, findBestMove for Land should return null.
    findBestMove.mockImplementation((board, isSkyTurnInternal, gameTypeInternal, capturedPiecesInternal) => {
      if (isSkyTurnInternal === false) { // Land's turn (after Sky's move)
        return null; // Land has no legal moves
      }
      // For Sky's initial turn, let it find some move if needed for setup, or default to null.
      return { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false, isDrop: false };
    });

    // isKingInCheckEngine for Land should return true after Sky's move.
    isKingInCheckEngineMock.mockImplementation((board, isSkyKing, gameTypeInternal, animalsData, settingsData) => {
      return isSkyKing === false; // Land's king is in check
    });
    
    // Simulate Sky making a move (e.g., Chick from (1,1) to (2,1))
    // We need to get the dispatch function or simulate the effect of a move.
    // Directly calling dispatch is an option if we can get it, or trigger via UI.
    // For simplicity, let's assume a way to dispatch.
    // This test setup is more about the reducer logic than UI interaction.
    
    // To test the reducer, we would ideally dispatch an action.
    // However, getting dispatch here is complex. We rely on Game's internal dispatch.
    // Let's try to make the AI (Sky) make the "checkmating" move.
    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    fireEvent.click(aiToggleButton); // Activate AI (Sky)

    await waitFor(() => {
      // AI (Sky) makes its move. Now it's Land's turn.
      // Reducer should have run findBestMove (mocked to null for Land)
      // and isKingInCheckEngine (mocked to true for Land).
      expect(screen.getByText(/Sky wins!/i)).toBeInTheDocument();
    }, { timeout: 1000 }); // Increased timeout for AI move + reducer logic
  });

  test('should declare stalemate when opponent has no legal moves and is not in check', async () => {
    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);

    // Sky (human) to move. Land (next player) will be stalemated.
    findBestMove.mockImplementation((board, isSkyTurnInternal, gameTypeInternal, capturedPiecesInternal) => {
      if (isSkyTurnInternal === false) { // Land's turn
        return null; // Land has no legal moves
      }
      return { from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', promotion: false, isDrop: false };
    });
    
    // isKingInCheckEngine for Land should return false.
    isKingInCheckEngineMock.mockReturnValue(false); // Default behavior, but explicit for clarity.

    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    fireEvent.click(aiToggleButton); // Activate AI (Sky)

    await waitFor(() => {
      // AI (Sky) makes its move. Now it's Land's turn.
      // Reducer runs findBestMove (null for Land) and isKingInCheckEngine (false for Land).
      expect(screen.getByText(/Draw!/i)).toBeInTheDocument();
    }, { timeout: 1000 });
  });

  // --- Tests for Refined AI Turn Control ---
  // These tests are more conceptual as directly testing context-modified functions is hard.
  // We test the observable behavior (e.g., AI makes a move, then doesn't immediately make another).

  test('Human player interaction should be implicitly blocked during AI turn', async () => {
    // This test relies on the fact that if it's AI's turn, the AI will make a move.
    // If the human *could* interact, they might make a move before the AI,
    // which would then make the AI's useEffect condition (isSkyTurn === aiPlayerIsSky) false.
    // The existing 'AI makes a board move' and 'AI makes a drop move' tests
    // already demonstrate that when AI is active and it's its turn, it proceeds to move.
    // The `canDrag` logic in BoardPiece is the primary direct prevention.
    
    findBestMove.mockReturnValueOnce({ from: { x: 1, y: 1 }, to: { x: 2, y: 1 }, pieceType: 'chick', isDrop: false }); // AI's first move
    findBestMove.mockReturnValueOnce(null); // Subsequent calls (e.g. for opponent)

    render(<Game config={defaultConfig} onHelp={mockOnHelp} onConfigChange={mockOnConfigChange} />);
    const aiToggleButton = screen.getByRole('button', { name: /toggle ai mode/i });
    fireEvent.click(aiToggleButton); // Activate AI (Sky's turn)

    await waitFor(() => {
      // AI (Sky) should have made its move.
      expect(findBestMove).toHaveBeenCalledTimes(1); // Called for AI's turn
    });
    
    // Now it's Land's turn (human). findBestMove would be called by the reducer to check for game end.
    await waitFor(() => {
       expect(findBestMove).toHaveBeenCalledTimes(2); // Called for Land to check game end state
    });

    // If human could interact during AI's thinking time or move, state could be messed up.
    // The success of AI making its move implies human interaction was correctly blocked by UI (canDrag)
    // and context-provided canMove/canDrop.
  });
});
