export const handleShiftTurn = (context) => {
  const lobby = context.get("lobby");
  const game = lobby.getGame();
  game.shiftTurn();
  const currentGameState = game.currentState();
  return context.json(currentGameState);
};
