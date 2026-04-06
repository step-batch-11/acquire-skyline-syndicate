import { createApp } from "./src/app.js";
import { Lobby } from "./src/models/lobby.js";
import { createGame } from "./src/utils.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;

  const lobbyInstance = new Lobby();
  const mockPlayers = ["yash", "pradipta"];
  const game = createGame(mockPlayers);
  const app = createApp(lobbyInstance, game);
  Deno.serve({ port }, app.fetch);
};

main();
