import { removeFocus } from "./board_ui.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { renderBoard } from "./initial_setup.js";

export const handlePlacingTile = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const containerClass = tileContainer.getAttribute("class");
  if (containerClass === "board") return;

  const tile = tileContainer.querySelector("p").textContent;
  if (!tilesInPlayerHand.includes(tile)) return;

  removeFocus(board, tilesInPlayerHand);
  const updatedTiles = await updateTiles(tile);
  renderBoard(updatedTiles.tilesOnBoard, updatedTiles.playerTiles);
};

export const handleAssignTile = async () => {
  const { playerTiles, tilesOnBoard } = await assignNewTiles();
  renderBoard(tilesOnBoard, playerTiles);
};
