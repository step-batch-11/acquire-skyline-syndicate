import { eventsForPlacingATile } from "./board_events.js";
import { removeFocus } from "./board_ui.js";
import { assignNewTiles, updateTiles } from "./game_state.js";
import { renderBoard } from "./initial_setup.js";
import { renderTilesInHand } from "./render.js";

const noOp = () => {};

export const handleTilePlacement = async (
  board,
  tileContainer,
  tilesInPlayerHand,
) => {
  const tile = tileContainer.id.split("-")[1];

  const updatedTiles = await updateTiles(tile);
  removeFocus(board, tilesInPlayerHand);
  renderBoard(updatedTiles.tilesOnBoard);
  renderTilesInHand(updatedTiles.playerTiles);
  const action = eventsForPlacingATile[updatedTiles.action] || noOp;
  action(tileContainer);
};

export const handleAssignTile = async () => {
  const { playerTiles, tilesOnBoard } = await assignNewTiles();
  renderBoard(tilesOnBoard, playerTiles);
};
