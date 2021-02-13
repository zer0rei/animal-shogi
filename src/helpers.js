export const randomize = (num, offset) =>
  num - offset + Math.floor(Math.random() * offset * 2);

export const times = (num, callback) =>
  [...Array(num)].map((e, i) => callback(i));

export const toAlpha = (num) => String.fromCharCode(64 + num);

export const toNumeric = (char) => char.charCodeAt(0) - "A".charCodeAt(0) + 1;

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
