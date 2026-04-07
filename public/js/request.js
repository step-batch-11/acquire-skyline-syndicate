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

export const getLobbyDetails = async () => {
  return await getData("/lobby/lobby-details");
};

export const postData = async (endPoint, content) => {
  const response = await fetch(endPoint, {
    method: "post",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(content),
  });

  return await response.json();
};
