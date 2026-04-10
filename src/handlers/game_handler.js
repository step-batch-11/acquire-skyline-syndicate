export const handleShiftTurn = (c) => {
  const gameManager = c.get("gameManager");
  const game = gameManager.game;
  const playerId = extractRequestedPlayerId(c);
  game.shiftTurn(playerId);
  const currentGameState = game.currentState();
  return c.json(currentGameState);
};
