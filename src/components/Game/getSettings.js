const microInitialSetup = {
  A1: "giraffe",
  B1: "lion",
  C1: "elephant",
  B2: "chick",
  isSymmetric: true,
};

const gameTypes = {
  micro: { numRows: 4, numCols: 3, initialSetup: microInitialSetup },
  goro: {
    numRows: 6,
    numCols: 5,
    initialSetup: {
      A1: "cat", B1: "dog", C1: "lion", D1: "dog", E1: "cat",
      B2: "chick", C2: "chick", D2: "chick",
      isSymmetric: true,
    },
  },
  standard: { numRows: 9, numCols: 9, initialSetup: microInitialSetup },
};

const getSettings = (gameType) => {
  switch (gameType) {
    case "micro":
      return gameTypes.micro;
    case "goro":
      return gameTypes.goro;
    case "standard":
      return gameTypes.standard;
    default:
      return gameTypes.micro;
  }
};

export default getSettings;
