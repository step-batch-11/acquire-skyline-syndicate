import { chromium } from "playwright";

const hostGame = async (username, playerType) => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  await page.goto("http://localhost:8000/pages/login.html");

  await page.fill("#player_name", username);
  await page.click("#login");
  await page.click(`#${playerType}`);

  const lobbyId = await page.textContent("#lobbyId");
  return { lobbyId, page };
};

const joinGame = async (username, playerType, lobbyId) => {
  const browser = await chromium.launch({
    headless: false,
    args: ["--start-maximized"],
  });
  const context = await browser.newContext({ viewport: null });
  const page = await context.newPage();

  await page.goto("http://localhost:8000/pages/login.html");

  await page.fill("#player_name", username);
  await page.click("#login");
  await page.click(`#${playerType}`);

  await page.fill("#lobby_id", lobbyId);
  await page.click("#join_game");
};

const { lobbyId, page } = await hostGame("Gopi", "host");
await joinGame("Pradipta", "join", lobbyId);
await page.click("#start-btn");
await page.goto("http://localhost:8000/state?name=merge/two_equal");
