export const createTiles = () => {
  const tiles = [];
  const string = "abcdefghi";
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      tiles.push(`${row}${string[col]}`);
    }
  }
  return tiles;
};
