import process from "node:process";
const { chromium } = require("playwright");
const URL = "http://localhost:8000";
const createPages = async () => {
  const browser = await chromium.launch({ headless: false });
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();
  const context3 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();
  const page3 = await context3.newPage();

  return { page1, page2, page3 };
};

const loginPlayer = async (page, name) => {
  await page.goto(`${URL}/pages/login.html`);
  await page.fill("#player_name", name);
  await page.click(".login-btn");
};

const hostGame = async (page, name) => {
  await loginPlayer(page, name);
  await page.click("#host");
};

const joinRoom = async (page, name) => {
  await loginPlayer(page, name);
  await page.click("#join");
  await page.fill("#lobby_id", "asd");
  await page.click("#join_game");
};

const loginIntoGame = async () => {
  const { page1, page2, page3 } = await createPages();

  await hostGame(page1, "player1");
  await joinRoom(page2, "player2");
  await joinRoom(page3, "player3");

  await page1.click("#start-btn");
  return { page1, page2, page3 };
};

const loadGame = async ({ page1 }, name) => {
  await page1.goto(`${URL}/state?name=${name}`);
};

const main = async ([name]) => {
  const res = await loginIntoGame();
  if (name) return loadGame(res, name);
};
main(process.argv.slice(2));
