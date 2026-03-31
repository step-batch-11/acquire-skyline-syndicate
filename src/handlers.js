export const handleUpdateTiles = async (context) => {
  const { tile } = await context.req.json();
  const service = context.get("service");
  const response = service.updatePlayerTiles(tile);

  return context.json(response);
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
