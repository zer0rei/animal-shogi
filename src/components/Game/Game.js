import React, { useState } from "react";
import PropTypes from "prop-types";
import Board from "../Board";
import { AnimalContext } from "../../contexts";
import lion from "../../assets/lion.svg";
import chick from "../../assets/chick.svg";
import hen from "../../assets/hen.svg";
import elephant from "../../assets/elephant.svg";
import giraffe from "../../assets/giraffe.svg";
import { times, toAlpha, expandMoves } from "../../helpers";
import styles from "./Game.module.css";

const miniInitialSetup = {
  A1: "giraffe",
  B1: "lion",
  C1: "elephant",
  B2: "chick",
  isSymmetric: true,
};

const getAnimals = (type) => ({
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

const getSettings = (type) => {
  switch (type) {
    case "mini":
      return { numRows: 4, numCols: 3, initialSetup: miniInitialSetup };
    default:
      return { numRows: 9, numCols: 9 };
  }
};

const getInitialSquares = (type) => {
  const { numRows, numCols, initialSetup } = getSettings(type);
  let squares = [];
  times(numRows, (i) => {
    squares[i] = [];
    times(numCols, (j) => {
      const type = initialSetup[toAlpha(j + 1) + (i + 1)];
      if (type) {
        squares[i][j] = {
          type,
          isSky: i < numCols / 2,
          isEmpty: false,
        };
      } else {
        squares[i][j] = {
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
        if (squares[i][j].isEmpty && !squares[invI][invJ].isEmpty) {
          squares[i][j] = {
            ...squares[invI][invJ],
            isSky: !squares[invI][invJ].isSky,
          };
        }
      });
    });
  }
  return squares;
};

function Game({ config }) {
  const { type } = config;
  const [squares, setSquares] = useState(getInitialSquares(type));
  const { numRows, numCols } = getSettings(type);
  const numRowsInSky = Math.floor(numRows / 3);
  const animals = getAnimals(type);
  // expand moves
  const returnedAnimals = {};
  Object.keys(animals).forEach((animal) => {
    returnedAnimals[animal] = {
      ...animals[animal],
      moves: expandMoves(animals[animal].moves),
    };
  });
  return (
    <AnimalContext.Provider value={returnedAnimals}>
      <Board
        squares={squares}
        numCols={numCols}
        numRows={numRows}
        numRowsInSky={numRowsInSky}
      />
    </AnimalContext.Provider>
  );
}

Game.propTypes = {
  config: PropTypes.object,
};

export default Game;
