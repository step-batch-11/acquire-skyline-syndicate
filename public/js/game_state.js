import { postData } from "./request.js";

export const updateTiles = async (tile) => {
  const updatedTiles = await postData(
    "/turn/placeTile",
    { tile },
  );
  return updatedTiles;
};

export const assignNewTiles = async () => {
  const { playerTiles, tilesOnBoard } = await postData(
    "/turn/assignNewTileToPlayer",
  );
  return { playerTiles, tilesOnBoard };
};
