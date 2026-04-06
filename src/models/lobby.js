import { Deck } from "./deck.js";
import { Board } from "./board.js";
import { Hotels } from "./hotels.js";
import { Player } from "./player.js";
import { Game } from "./game.js";
import { shuffle } from "@std/random/shuffle";
import { Tile } from "./tile.js";
import { bankData } from "../bank_data.js";

const shuffleTiles = (tiles, shuffleFn = shuffle) => {
  return shuffleFn(tiles);
};

const createRowTiles = (col) => {
  const rowLabel = "abcdefghi";
  return Array.from(
    { length: 9 },
    (_, row) => new Tile(`${col + 1}${rowLabel[row]}`),
  );
};

const createTiles = () =>
  Array.from({ length: 12 }, (_, col) => createRowTiles(col)).flatMap(
    (tile) => tile,
  );

export class Lobby {
  #players = [];
  #lobbyState = "waiting";
  #threshold = 2;
  #game;
  constructor() {
  }

  addPlayerToLobby(playerName) {
    this.#players.push(playerName);
  }

  currentState() {
    if (this.#players.length >= this.#threshold) {
      this.#lobbyState = "ready";
    }
    return this.#lobbyState;
  }

  getActivePlayers() {
    return [...this.#players];
  }

  createGame(activePlayers) {
    const tiles = createTiles();

    const deck = new Deck(shuffleTiles(tiles));
    const board = new Board();
    const hotelsManager = Hotels.instantiateHotels(bankData);
    const players = activePlayers.map((player, i) => new Player(player, i));
    // const player = new Player("Gopi", 1);
    this.#game = new Game(deck, board, hotelsManager, players);
    this.#game.init();
  }

  getGame() {
    return this.#game;
  }
}
