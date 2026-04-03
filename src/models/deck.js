export class Deck {
  #tiles;
  constructor(tiles) {
    this.#tiles = tiles;
  }

  drawTiles(count = 1) {
    return this.#tiles.splice(0, count);
  }
}
