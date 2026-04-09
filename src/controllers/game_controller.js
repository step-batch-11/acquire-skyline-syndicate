import { extractRequestedPlayerId } from "./turn_controller.js";

export class GameController {
  constructor() {}

  startGame(c) {
    const gameManager = c.get("gameManager");
    const lobby = c.get("lobby");
    const sessions = c.get("sessions");

    const playerIdsMap = sessions.getPlayerIds();
    // const playerNameIds = [...playerIdsMap].filter(([playerId, _]) =>
    //   playerIds.includes(playerId)
    // );
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
  const game = gameManager.getGame();
  const playerId = extractRequestedPlayerId(c);
  game.shiftTurn(playerId);
  const currentGameState = game.currentState(playerId);
  return c.json(currentGameState);
};
