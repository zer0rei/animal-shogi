import lion from "../../assets/lion.svg";
import chick from "../../assets/chick.svg";
import hen from "../../assets/hen.svg";
import elephant from "../../assets/elephant.svg";
import giraffe from "../../assets/giraffe.svg";
import cat from "../../assets/cat.svg";
import dog from "../../assets/dog.svg";

export const getAnimals = (gameType) => ({
  lion: {
    image: lion,
    color: "#f8b9bb",
    skyColor: "#d8898b",
    moves: ["s**"],
  },
  chick: { 
    image: chick, 
    color: "#ebf2d4", 
    skyColor: "#c8d0a0",
    moves: ["stm"] 
  },
  cat: {
    image: cat,
    color: "#a6d8a6",
    skyColor: "#85b985",
    moves: ["st*", "sbl", "sbr"] 
  },
  dog: {
    image: dog,
    color: "#f8c9a0",
    skyColor: "#e0a878",
    moves: ["st*", "sm*", "sbm"] 
  },
  empoweredCat: {
    image: cat,
    color: "#f8c9a0",
    skyColor: "#e0a878",
    moves: ["st*", "sm*", "sbm"] 
  },
  hen: { 
    image: hen, 
    color: "#f8c9a0",
    skyColor: "#e0a878",
    moves: ["st*", "sm*", "sbm"] 
  },
  elephant: {
    image: elephant,
    color: "#cdaed0",
    skyColor: "#a889ac",
    moves: ["stl", "str", "sbl", "sbr"],
  },
  giraffe: { 
    image: giraffe, 
    color: "#cdaed0", 
    skyColor: "#a889ac",
    moves: ["s*m", "sm*"] 
  },
});

const promotions = {
  chick: "hen",
  cat: "empoweredCat",
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
