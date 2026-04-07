import { hotels } from "./configs/hotels_data.js";
import { Board } from "./models/board.js";
import { Deck } from "./models/deck.js";
import { Game } from "./models/game.js";
import { Hotels } from "./models/hotels.js";
import { Player } from "./models/player.js";
import { shuffle } from "@std/random/shuffle";
import { Tile } from "./models/tile.js";

export const shuffleTiles = (tiles, shuffleFn = shuffle) => {
  return shuffleFn(tiles);
};

export const createTiles = () => {
  const tiles = [];
  const string = "abcdefghi";
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      tiles.push(`${row}${string[col]}`);
    }
  }
  return tiles;
};

export const createGame = (activePlayers) => {
  const tiles = createTiles();

  const deck = new Deck(shuffleTiles(tiles.map((tile) => new Tile(tile))));
  const board = new Board();
  const hotelsManager = Hotels.instantiateHotels(hotels);
  const players = activePlayers.map(([id, name]) => new Player(name, id));
  const game = new Game(deck, board, hotelsManager, players);
  game.init();
  return game;
};

export const models = {
  "Tile": Tile,
};

export const injectData = (activePlayers) => {
  const tiles = createTiles();

  const deck = new Deck(shuffleTiles(tiles.map((tile) => new Tile(tile))));
  const board = new Board();
  const hotelsManager = Hotels.instantiateHotels(hotels);
  const players = activePlayers.map((player, i) => new Player(player, i));
  const game = new Game(deck, board, hotelsManager, players);
  game.init();
  return game;
};
