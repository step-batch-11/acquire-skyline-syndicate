export const handleUpdateTiles = async (context) => {
  const { tile } = await context.req.json();
  const service = context.get("service");
  const { playerTiles, tilesOnBoard } = service.updatePlayerTiles(tile);
  return context.json({ playerTiles, tilesOnBoard });
};
