import { eventsForPlacingATile } from "./board_events.js";
import { removeFocus } from "./board_ui.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { renderBoard } from "./initial_setup.js";

export const handleTilePlacement = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const tile = tileContainer.id.split("-")[1];

  const updatedTiles = await updateTiles(tile);
  removeFocus(board, tilesInPlayerHand);
  renderBoard(updatedTiles.tilesOnBoard, updatedTiles.playerTiles);
  eventsForPlacingATile[updatedTiles.action](tileContainer);
};

export const handleAssignTile = async () => {
  const { playerTiles, tilesOnBoard } = await assignNewTiles();
  renderBoard(tilesOnBoard, playerTiles);
};
