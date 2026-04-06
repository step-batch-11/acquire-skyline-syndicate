import { postData } from "./request.js";

export const updateTiles = async (tile) => {
  const updatedTiles = await postData(
    "/turn/place-tile",
    { tile },
  );
  return updatedTiles;
};

export const assignNewTiles = async () => {
  const currentState = await postData(
    "/turn/assign-new-tile-to-player",
  );
  return currentState;
};
