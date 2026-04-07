// import { hotels } from "../mock-data/hotels_data.js";
// import { createTiles, shuffleTiles } from "../utils.js";
// import { Board } from "./board.js";
// import { Deck } from "./deck.js";
// import { Game } from "./game.js";
// import { Hotels } from "./hotels.js";
// import { Player } from "./player.js";
// import { Tile } from "./tile.js";

export class GameManager {
  #game;
  #createGame;

  constructor(createGame) {
    this.#createGame = createGame;
  }

  createGame(activePlayers) {
    this.#game = this.#createGame(activePlayers);
  }

  getGame() {
    return this.#game;
  }
}
