export const fetchData = async () => {
  const response = await fetch("/initial-setup");
  return await response.json();
};
