import { times, toAlpha } from "../../helpers";
import getSettings from "./getSettings";

const getInitialPieces = (gameType) => {
  const { numRows, numCols, initialSetup } = getSettings(gameType);
  let boardPieces = [];
  times(numRows, (i) => {
    boardPieces[i] = [];
    times(numCols, (j) => {
      const type = initialSetup[toAlpha(j + 1) + (i + 1)];
      if (type) {
        boardPieces[i][j] = {
          type,
          isSky: i < numCols / 2,
          isEmpty: false,
        };
      } else {
        boardPieces[i][j] = {
          isEmpty: true,
        };
      }
    });
  });
  if (initialSetup.isSymmetric) {
    times(numRows, (i) => {
      times(numCols, (j) => {
        const invI = numRows - i - 1;
        const invJ = numCols - j - 1;
        if (boardPieces[i][j].isEmpty && !boardPieces[invI][invJ].isEmpty) {
          boardPieces[i][j] = {
            ...boardPieces[invI][invJ],
            isSky: !boardPieces[invI][invJ].isSky,
          };
        }
      });
    });
  }
  return {
    board: boardPieces,
    captured: {
      land: [],
      sky: [],
    },
  };
};

export default getInitialPieces;
