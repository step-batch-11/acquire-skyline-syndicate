export class GameEngine {
  constructor() {}

  adjacentTilesOf(tile) {
    const adjacentTiles = [];
    const alphabets = "abcdefghi";

    const alphabet = tile[tile.length - 1];
    const tileNumber = Number(tile.slice(0, tile.indexOf(alphabet)));

    if (tileNumber - 1 > 0) {
      adjacentTiles.push(`${tileNumber - 1}${alphabet}`);
    }

    if (tileNumber + 1 <= 12) {
      adjacentTiles.push(`${tileNumber + 1}${alphabet}`);
    }

    const alphabetIndex = alphabets.indexOf(alphabet);

    if (alphabetIndex > 0) {
      adjacentTiles.push(`${tileNumber}${alphabets[alphabetIndex - 1]}`);
    }

    if (alphabetIndex < 8) {
      adjacentTiles.push(`${tileNumber}${alphabets[alphabetIndex + 1]}`);
    }

    return adjacentTiles;
  }
}
