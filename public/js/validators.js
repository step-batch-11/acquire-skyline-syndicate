export const canPlaceTile = (tileContainer, tilesInPlayerHand) => {
  const containerClass = tileContainer.getAttribute("class");
  if (containerClass === "board") return false;

  const tile = tileContainer.id.split("-")[1];
  return tilesInPlayerHand.includes(tile);
};
