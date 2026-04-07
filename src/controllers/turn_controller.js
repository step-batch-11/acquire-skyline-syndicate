export class TurnController {
  currentState(c) {
    const gameManagaer = c.get("gameManager");
    const game = gameManagaer.getGame();
    return c.json(game.currentState());
  }

  async placeTile(c) {
    const { tile } = await c.req.json();
    const gameManagaer = c.get("gameManager");
    const game = gameManagaer.getGame();
    game.placeTile(tile);
    return c.json(game.currentState());
  }

  async buildHotel(c) {
    const { hotelToFound } = await c.req.json();
    const gameManagaer = c.get("gameManager");
    const game = gameManagaer.getGame();
    game.buildHotel(hotelToFound);
    return c.json(game.currentState());
  }

  assignNewTile(c) {
    const gameManagaer = c.get("gameManager");
    const game = gameManagaer.getGame();
    game.assignNewTile();
    return c.json(game.currentState());
  }

  async buyStocks(c) {
    const cart = await c.req.json();
    const gameManagaer = c.get("gameManager");
    const game = gameManagaer.getGame();
    const res = game.buyStocks(cart);
    return c.json(res);
  }
}
