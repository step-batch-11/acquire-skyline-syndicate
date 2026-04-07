import { hotels } from "./mock-data/hotels_data.js";
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
  // playerNameIds: [
  //   [ "8673be37-c245-4660-9d55-b9941c91ca92", "Som" ],
  //   [ "4b163aed-c2b6-49a7-9e16-ce0be347b264", "Haider" ]
  // ]

  const tiles = createTiles();

  const deck = new Deck(shuffleTiles(tiles.map((tile) => new Tile(tile))));
  const board = new Board();
  const hotelsManager = Hotels.instantiateHotels(hotels);
  const players = activePlayers.map(([id, name]) => new Player(name, id));
  const game = new Game(deck, board, hotelsManager, players);
  game.init();
  return game;
};
