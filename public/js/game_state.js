export const updateTiles = (tile, tilesOnBoard, playerTiles) => {
  const tileIndex = playerTiles.indexOf(tile);
  playerTiles.splice(tileIndex, 1);
  tilesOnBoard.push(tile);
};
