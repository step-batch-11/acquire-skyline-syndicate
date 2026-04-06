import { createApp } from "./src/app.js";
import { Lobby } from "./src/models/lobby.js";
import { playerSession } from "./src/models/playerSession.js";

const main = () => {
  const port = Deno.env.get("PORT") || 8000;

  const lobbyInstance = new Lobby();
  const sessions = new playerSession();
  const app = createApp(lobbyInstance, sessions);
  Deno.serve({ port }, app.fetch);
};

main();
