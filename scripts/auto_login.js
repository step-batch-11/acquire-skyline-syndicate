const { chromium } = require('playwright');

const createPages = async () => {
  const browser = await chromium.launch({ headless: false });
  const context1 = await browser.newContext();
  const context2 = await browser.newContext();

  const page1 = await context1.newPage();
  const page2 = await context2.newPage();

  return { page1, page2 };
};

const loginPlayer = async (page, name) => {
  await page.goto('http://localhost:8000/pages/login.html');
  await page.fill('#player_name', name);
  await page.click('.login-btn');
};

const hostGame = async(page, name) => {
  await loginPlayer(page,name);
  await page.click('#host');
}

const joinRoom = async (page,name) => {
  await loginPlayer(page,name);
  await page.click('#join');
  await page.fill('#lobby_id', 'asd');
  await page.click('#join_game');
}

const loginIntoGame = async () => {
  const { page1, page2 } = await createPages();

  await hostGame(page1, 'player1');
  await joinRoom(page2, 'player2');

  await page1.click("#start-btn");
}

loginIntoGame();