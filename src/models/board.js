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
}
