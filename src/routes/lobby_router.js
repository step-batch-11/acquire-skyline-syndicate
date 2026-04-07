import { Hono } from "hono";
import { LobbyController } from "../controllers/lobby_controller.js";

export const createLobbyRouter = () => {
  const lobby = new Hono();
  const controller = new LobbyController();

  lobby.get("/host", controller.hostLobby);
  lobby.get("/join", controller.redirectToJoinLobby);
  lobby.post("/join-lobby", controller.joinLobby);
  // lobby.get("/create-game", controller.createGame);
  // lobby.get("/start-game", controller.gameState);
  lobby.get("/lobby-details", controller.lobbyDetails);

  return lobby;
};
