export class Board {
  #placedTiles;
  lastTile;

  constructor() {
    this.#placedTiles = [];
  }

  isTileOnBoard(tileId) {
    const placedTileIds = this.#placedTiles.map((tile) => tile.id);
    return placedTileIds.includes(tileId);
  }

  getPlacedTiles() {
    return this.#placedTiles.map((tile) => tile.id);
  }

  place(tile) {
    this.#placedTiles.push(tile);
    this.lastTile = tile;
  }

  hasAdjacentForLastTile() {
    return this.#placedTiles.some((placedTile) =>
      this.lastTile.isNeighbouringTile(placedTile)
    );
  }

  adjacentTiles(tile) {
    return tile
      .neighbourTiles()
      .filter((tile) =>
        this.#placedTiles.find((placedTile) => placedTile.id === tile)
      );
  }
}
