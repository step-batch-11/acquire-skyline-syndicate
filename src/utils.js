import { bankData } from "./bank_data.js";
import { Board } from "./models/board.js";
import { Deck } from "./models/deck.js";
import { Game } from "./models/game.js";
import { Hotels } from "./models/hotels.js";
import { Player } from "./models/player.js";
import { createTiles } from "./tile_data.js";
import { shuffle } from "@std/random/shuffle";


const shuffleTiles = (tiles, shuffleFn = shuffle) => {
  return shuffleFn(tiles);
};

export const createGame = (activePlayers) => {
    const tiles = createTiles();

    const deck = new Deck(shuffleTiles(tiles));
    const board = new Board();
    const hotelsManager = Hotels.instantiateHotels(bankData);
    const players = activePlayers.map((player, i) => new Player(player, i));
    // const player = new Player("Gopi", 1);
    const game = new Game(deck, board, hotelsManager, players);
    game.init();
  }