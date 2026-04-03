export class Board {
  #placedTiles;

  constructor() {
    this.#placedTiles = [];
  }

  getPlacedTiles() {
    return [...this.#placedTiles];
  }

  place(tileId) {
    this.#placedTiles.push(tileId);
  }
}
