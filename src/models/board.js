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

  hasAdjacentForLastTile() {
    return this.#placedTiles.some((placedTile) =>
      this.lastTile.isNeighbouringTile(placedTile)
    );
  }

  adjacentTiles(tile) {
    return this.#placedTiles.filter((placedTile) =>
      placedTile.isNeighbouringTile(tile)
    );
  }
}
