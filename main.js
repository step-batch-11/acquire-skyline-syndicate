import { createApp } from "./src/app.js";
import { GameManager } from "./src/models/game_manager.js";
import { Lobby } from "./src/models/lobby.js";
import { playerSession } from "./src/models/playerSession.js";
import { createGame } from "./src/utils.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;

  const lobby = new Lobby();
  const sessions = new playerSession();

  const gameManager = new GameManager(createGame);
  const isDevMode = Deno.env.get("dev");
  const app = createApp(sessions, lobby, gameManager, isDevMode);
  Deno.serve({ port }, app.fetch);
};

main();
