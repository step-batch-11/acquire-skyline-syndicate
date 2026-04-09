export const canPlaceTile = (tileContainer, tilesInPlayerHand) => {
  const containerClass = tileContainer.getAttribute("class");
  if (containerClass === "board") return false;

  const playerTile = tileContainer.id.split("-")[1];
  return tilesInPlayerHand.some((tile) => playerTile === tile.tileId);
};
