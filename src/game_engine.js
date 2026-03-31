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

  actionForPlacingTile(tile, placedTiles, hotels) {
    const adjacentTiles = this.adjacentTilesOf(tile);
    const isAdjacentTile = adjacentTiles.some((tile) =>
      placedTiles.includes(tile)
    );
    if (!isAdjacentTile) return "nothing";

    if (
      this.getAdjacentHotel(adjacentTiles, hotels)["hotelName"] !== undefined
    ) {
      return "expand";
    }
    return "build hotel";
  }

  getAdjacentHotel(adjacentTiles, hotels) {
    for (const hotel in hotels) {
      const isTileInHotelChain = adjacentTiles.some((adjacentTile) =>
        hotels[hotel].tiles.includes(adjacentTile)
      );

      if (isTileInHotelChain) return { hotelName: hotel };
    }
    return {};
  }
}
