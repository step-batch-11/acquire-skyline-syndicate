import { hotels } from "./mock-data/hotels_data.js";
import { Board } from "./models/board.js";
import { Deck } from "./models/deck.js";
import { Game } from "./models/game.js";
import { Hotels } from "./models/hotels.js";
import { Player } from "./models/player.js";
import { createTiles } from "./mock-data/tiles_data.js";
import { shuffle } from "@std/random/shuffle";
import { Tile } from "./models/tile.js";

const shuffleTiles = (tiles, shuffleFn = shuffle) => {
  return shuffleFn(tiles);
};

export const createGame = (activePlayers) => {
  const tiles = createTiles();

  const deck = new Deck(shuffleTiles(tiles.map((tile) => new Tile(tile))));
  const board = new Board();
  const hotelsManager = Hotels.instantiateHotels(hotels);
  const players = activePlayers.map((player, i) => new Player(player, i));
  const game = new Game(deck, board, hotelsManager, players);
  game.init();
  return game;
};
