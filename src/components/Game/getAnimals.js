import lion from "../../assets/lion.svg";
import chick from "../../assets/chick.svg";
import hen from "../../assets/hen.svg";
import elephant from "../../assets/elephant.svg";
import giraffe from "../../assets/giraffe.svg";

export const getAnimals = (gameType) => ({
  lion: {
    image: lion,
    color: "#f8b9bb",
    moves: ["s**"],
  },
  chick: { image: chick, color: "#ebf2d4", moves: ["stm"] },
  hen: { image: hen, color: "#ebf2d4", moves: ["st*", "sm*", "sbm"] },
  elephant: {
    image: elephant,
    color: "#cdaed0",
    moves: ["stl", "str", "sbl", "sbr"],
  },
  giraffe: { image: giraffe, color: "#cdaed0", moves: ["s*m", "sm*"] },
});

const promotions = {
  chick: "hen",
};

export const getPromoted = (type) => {
  return promotions[type] || type;
};

export const getDemoted = (type) => {
  for (let key of Object.keys(promotions)) {
    if (promotions[key] === type) {
      return key;
    }
  }
  return type;
};

export const isPromoted = (type) => {
  return Object.values(promotions).includes(type);
};

export const expandMoves = (moves) => [
  ...new Set(
    moves
      .reduce((accum, curr) => {
        let newMoves = [];
        if (curr[1] === "*") {
          ["t", "m", "b"].forEach((x) => newMoves.push(curr[0] + x + curr[2]));
        } else {
          newMoves.push(curr);
        }
        newMoves.forEach((newMove) => {
          if (newMove[2] === "*") {
            ["l", "m", "r"].forEach((x) =>
              accum.push(newMove.substr(0, 2) + x)
            );
          } else {
            accum.push(newMove);
          }
        });
        return accum;
      }, [])
      .filter((move) => move.substr(1, 3) !== "mm")
  ),
];

export const expandAllMoves = (animals) => {
  const returnedAnimals = {};
  Object.keys(animals).forEach((animal) => {
    returnedAnimals[animal] = {
      ...animals[animal],
      moves: expandMoves(animals[animal].moves),
    };
  });
  return returnedAnimals;
};

export default (gameType) => expandAllMoves(getAnimals(gameType));
