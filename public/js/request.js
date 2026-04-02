export const fetchData = async (route) => {
  const response = await fetch(route);
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
