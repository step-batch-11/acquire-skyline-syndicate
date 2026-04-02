export class Tile {
  #tile;

  constructor(xCoordinate, yCoordinate) {
    this.#tile = { xCoordinate, yCoordinate, isPlaced: false };
  }

  markAsPlaced() {
    this.#tile.isPlaced = true;
  }
}
