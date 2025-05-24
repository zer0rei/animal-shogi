const miniInitialSetup = {
  A1: "giraffe",
  B1: "lion",
  C1: "elephant",
  B2: "chick",
  isSymmetric: true,
};

const gameTypes = {
  mini: { numRows: 4, numCols: 3, initialSetup: miniInitialSetup },
  animalShogi: {
    numRows: 6,
    numCols: 5,
    initialSetup: {
      A1: "cat", B1: "dog", C1: "lion", D1: "dog", E1: "cat",
      B2: "chick", C2: "chick", D2: "chick",
      isSymmetric: true,
    },
  },
  standard: { numRows: 9, numCols: 9, initialSetup: miniInitialSetup },
};

const getSettings = (gameType) => {
  switch (gameType) {
    case "micro":
      return gameTypes.mini;
    case "animalShogi":
      return gameTypes.animalShogi;
    case "standard":
      return gameTypes.standard;
    default:
      return gameTypes.mini; // Changed default to mini
  }
};

export default getSettings;
