export class Board {
  #placedTiles;
  lastTile;

  constructor() {
    this.#placedTiles = [];
  }

  getPlacedTiles() {
    return [...this.#placedTiles];
  }

  place(tile) {
    this.#placedTiles.push(tile);
    this.lastTile = tile;
  }

  adjacentTiles(tile) {
    return this.#placedTiles.filter((placedTile) =>
      placedTile.isNeighbouringTile(tile)
    );
  }
}
