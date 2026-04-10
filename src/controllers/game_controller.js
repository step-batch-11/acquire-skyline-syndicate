import { extractRequestedPlayerId } from "./turn_controller.js";

export class GameController {
  constructor() {}

  startGame(c) {
    const gameManager = c.get("gameManager");
    const lobby = c.get("lobby");
    const sessions = c.get("sessions");
    const playerIdsMap = sessions.playerIds;
    gameManager.createGame(playerIdsMap);
    lobby.transitionToStart();
    return c.redirect("/pages/lobby.html", 302);
  }

  redirectToGame(c) {
    return c.redirect("/pages/game.html", 302);
  }
}

export const handleShiftTurn = (c) => {
  const gameManager = c.get("gameManager");
  const game = gameManager.game;
  const playerId = extractRequestedPlayerId(c);
  try {
    const response = game.shiftTurn(playerId);
    return c.json(response, 200);
  } catch (error) {
    return c.json(error, 400);
  }
};
