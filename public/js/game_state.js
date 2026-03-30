import { postData } from "./controllers.js";

export const updateTiles = async (tile) => {
  const { playerTiles, tilesOnBoard } = await postData(
    "/update-player-tiles",
    { tile },
  );
  return { playerTiles, tilesOnBoard };
};
