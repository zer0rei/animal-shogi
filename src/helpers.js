export const randomize = (num, offset) =>
  num - offset + Math.floor(Math.random() * offset * 2);

export const times = (num, callback) =>
  [...Array(num)].map((e, i) => callback(i));

export const toAlpha = (num) => String.fromCharCode(64 + num);

export const toNumeric = (char) => char.charCodeAt(0) - "A".charCodeAt(0) + 1;

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

export function cls() {
  let cls = "";
  for (let c of arguments) {
    if (typeof c === "object") {
      for (let k in c) {
        if (c[k]) {
          cls && (cls += " ");
          cls += k;
        }
      }
    } else {
      if (c) {
        cls && (cls += " ");
        cls += c;
      }
    }
  }
  return cls;
}
