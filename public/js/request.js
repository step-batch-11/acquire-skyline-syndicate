export const getData = async (endPoint) => {
  const response = await fetch(endPoint);
  return await response.json();
};

export const gameState = async () => {
  return await getData("/turn/current-state");
};

export const getLobbyState = async () => {
  return await getData("/lobby/state");
};

export const listActivePlayers = async () => {
  const response = await fetch("/lobby/active-players");
  return await response.json();
};

export const postData = async (endPoint, content) => {
  const response = await fetch(endPoint, {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(content),
  });

  return await response.json();
};

export const updateTiles = async (tile) => {
  const updatedTiles = await postData("/turn/place-tile", { tile });
  return updatedTiles;
};

export const assignNewTiles = async () => {
  const currentState = await postData("/turn/assign-new-tile-to-player");
  return currentState;
};
