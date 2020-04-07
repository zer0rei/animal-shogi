import lion from "../../assets/lion.svg";
import chick from "../../assets/chick.svg";
import hen from "../../assets/hen.svg";
import elephant from "../../assets/elephant.svg";
import giraffe from "../../assets/giraffe.svg";

const getAnimals = (gameType) => ({
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

export default getAnimals;
