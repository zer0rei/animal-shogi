const miniInitialSetup = {
  A1: "giraffe",
  B1: "lion",
  C1: "elephant",
  B2: "chick",
  isSymmetric: true,
};

const gameTypes = {
  mini: { numRows: 4, numCols: 3, initialSetup: miniInitialSetup },
  standard: { numRows: 9, numCols: 9 },
};

const getSettings = (gameType) => {
  switch (gameType) {
    case "mini":
      return gameTypes.mini;
    case "standard":
      return gameTypes.standard;
    default:
      return gameTypes.standard;
  }
};

export default getSettings;
