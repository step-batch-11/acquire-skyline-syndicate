import { bankData } from "./src/bank_data.js";
import { createApp } from "./src/app.js";
import { Services } from "./src/services.js";
import { createTiles } from "./src/tile_data.js";
import { GameEngine } from "./src/game_engine.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;
  const tiles = createTiles();
  const service = new Services(tiles, bankData);
  const gameEngine = new GameEngine();
  const app = createApp(service, gameEngine);
  Deno.serve({ port }, app.fetch);
};

main();
