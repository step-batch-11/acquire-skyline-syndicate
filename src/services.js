import { shuffle } from "@std/random";

export class Services {
  #tiles;
  #hotels;
  #unplacedTiles;
  #player;
  #placedTiles;
  constructor(tiles, hotels) {
    this.#player = { amount: 6000 };
    this.#tiles = tiles;
    this.#hotels = hotels;
  }

  #shuffleTiles(shuffleFn) {
    this.#unplacedTiles = shuffleFn(this.#tiles);
  }

  #allocateTilesToPlayers() {
    const playerTiles = this.#unplacedTiles.splice(0, 6);
    this.#player.playerTiles = playerTiles;
  }

  #placeTiles() {
    this.#placedTiles = this.#unplacedTiles.splice(0, 6);
  }

  initialSetup(shuffleFn = shuffle) {
    this.#shuffleTiles(shuffleFn);
    this.#placeTiles();
    this.#allocateTilesToPlayers();
    return {
      ...this.#player,
      tilesOnBoard: this.#placedTiles,
      bankData: this.#hotels,
    };
  }
}
