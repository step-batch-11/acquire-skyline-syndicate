export const handleShiftTurn = (context) => {
  const gameManager = context.get("gameManager");
  const game = gameManager.getGame();
  game.shiftTurn();
  const currentGameState = game.currentState();
  return context.json(currentGameState);
};
