import { postData } from "./controllers.js";

export const updateTiles = async (tile) => {
  const response = await postData(
    "/update-player-tiles",
    { tile },
  );

  return response;
};
