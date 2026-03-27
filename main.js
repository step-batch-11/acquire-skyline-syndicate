import { createApp } from "./src/app.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;
  const app = createApp();
  Deno.serve({ port }, app.fetch);
};

main();
