import { bankData as hotels } from "./src/bank_data.js";
import { createApp } from "./src/app.js";
import { Services } from "./src/services.js";
import { GameEngine } from "./src/game_engine.js";
import { Deck } from "./src/models/deck.js";
import { Board } from "./src/models/board.js";
import { Hotels } from "./src/models/hotels.js";
import { Player } from "./src/models/player.js";
import { Game } from "./src/models/game.js";

const createTiles = () => {
  const tiles = [];
  const string = "abcdefghi";
  for (let col = 0; col < string.length; col++) {
    for (let row = 1; row <= 12; row++) {
      tiles.push(`${row}${string[col]}`);
    }
  }
  return tiles;
};

const main = () => {
  const port = Deno.env.get("PORT") || 8000;
  const tiles = createTiles();
  const service = new Services(tiles, hotels);
  const gameEngine = new GameEngine();
  const deck = new Deck(tiles);
  const board = Board.create();
  const hotelsManager = Hotels.instantiateHotels(hotels);
  const player = new Player("Gopi", 1);
  const game = new Game(deck, board, hotelsManager, player);
  const app = createApp(service, gameEngine, game);
  Deno.serve({ port }, app.fetch);
};

main();
