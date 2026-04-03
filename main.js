import { bankData as hotels } from "./src/bank_data.js";
import { createApp } from "./src/app.js";
import { Services } from "./src/services.js";
import { GameEngine } from "./src/game_engine.js";
import { Deck } from "./src/models/deck.js";
import { Tile } from "./src/models/tile.js";
import { Board } from "./src/models/board.js";
import { Hotels } from "./src/models/hotels.js";
import { Player } from "./src/models/player.js";
import { Game } from "./src/models/game.js";
import { shuffle } from "@std/random/shuffle";

const createTiles = () => {
  const tiles = [];
  const string = "abcdefghi";
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      const tileId = `${row}${string[col]}`;
      const tile = new Tile(tileId);
      tiles.push(tile);
    }
  }
  return tiles;
};

const shuffleTiles = (tiles, shuffleFn = shuffle) => {
  return shuffleFn(tiles);
};

const main = () => {
  const port = Deno.env.get("PORT") || 8000;
  const tiles = createTiles();
  const service = new Services(tiles, hotels);
  const gameEngine = new GameEngine();
  const deck = new Deck(shuffleTiles(tiles));
  const board = new Board();
  const hotelsManager = Hotels.instantiateHotels(hotels);
  const players = ["player1", "player2"].map((playerName, id) =>
    new Player(playerName, id)
  );
  const game = new Game(deck, board, hotelsManager, players);
  game.init();
  const app = createApp(service, gameEngine, game);
  Deno.serve({ port }, app.fetch);
};

main();
