export class Board {
  #placedTiles;

  constructor() {
    this.#placedTiles = [];
  }

  getPlacedTiles() {
    return this.#placedTiles.map((tile) => tile.id);
  }

  place(tileId) {
    this.#placedTiles.push(tileId);
    return this.getPlacedTiles();
  }
}
