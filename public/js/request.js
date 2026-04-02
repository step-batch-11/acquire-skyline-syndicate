export const startGame = async () => {
  const response = await fetch("/lobby/startGame");
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
