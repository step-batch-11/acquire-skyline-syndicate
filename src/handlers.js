export const handleUpdateTiles = async (context) => {
  const { tile } = await context.req.json();
  const service = context.get("service");
  const { playerTiles, tilesOnBoard } = service.updatePlayerTiles(tile);
  return context.json({ playerTiles, tilesOnBoard });
};

export const handleInitialSetup = (context) => {
  const service = context.get("service");
  return context.json(service.initialSetup());
};

export const handleAssignTile = (context) => {
  const service = context.get("service");
  const { playerTiles, tilesOnBoard } = service.assignNewTile();
  return context.json({ playerTiles, tilesOnBoard });
};
