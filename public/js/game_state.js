import { postData } from "./controllers.js";

export const updateTiles = async (tile) => {
  const updatedTiles = await postData(
    "/update-player-tiles",
    { tile },
  );
  return updatedTiles;
};

export const assignNewTiles = async () => {
  const { playerTiles, tilesOnBoard } = await postData(
    "/assign-new-tile",
  );
  return { playerTiles, tilesOnBoard };
};
