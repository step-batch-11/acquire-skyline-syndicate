import { shuffle } from "@std/random/shuffle";

export class Deck {
  #tiles;
  constructor(tiles) {
    this.#tiles = tiles;
  }

  getTiles() {
    return [...this.#tiles];
  }

  shuffleTiles(shuffleFn = shuffle) {
    this.#tiles = shuffleFn(this.#tiles);
  }

  drawTiles(count = 1) {
    return this.#tiles.splice(0, count);
  }
}
