import { postData } from "./request.js";

export const updateTiles = async (tile) => {
  const updatedTiles = await postData(
    "/turn/placeTile",
    { tile },
  );
  return updatedTiles;
};

export const assignNewTiles = async () => {
  const currentState = await postData(
    "/turn/assignNewTileToPlayer",
  );
  return currentState;
};
