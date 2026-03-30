import { bankData } from "./src/bank_data.js";
import { createApp } from "./src/app.js";
import { Services } from "./src/services.js";
import { tiles } from "./src/tile_data.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;
  const service = new Services(tiles, bankData);
  const app = createApp(service);
  Deno.serve({ port }, app.fetch);
};

main();
