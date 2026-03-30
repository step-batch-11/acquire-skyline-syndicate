import { createApp } from "./src/app.js";
import { Services } from "./src/services.js";
import { createTiles } from "./src/tile_data.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;
  const tiles = createTiles();
  const service = new Services(tiles);
  const app = createApp(service);
  Deno.serve({ port }, app.fetch);
};

main();
