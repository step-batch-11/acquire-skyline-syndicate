export const handleShiftTurn = (context) => {
  const game = context.get("game");
  game.shiftTurn();
  const currentGameState = game.currentState();
  return context.json(currentGameState);
};
