export class Board {
  #placedTiles;
  lastTile;

  constructor() {
    this.#placedTiles = [];
  }

  isTileOnBoard(tileId) {
    const placedTileIds = this.#placedTiles.map((tile) => tile);
    return placedTileIds.includes(tileId);
  }

  getPlacedTiles() {
    return this.#placedTiles.map((tile) => ({ id: tile.id }));
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

  adjacentTilesOfLastTile() {
    return this.lastTile.getAllConnectedTiles(this.#placedTiles);
  }
}
