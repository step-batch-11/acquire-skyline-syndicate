import { Player } from "./models/player.js";
import { Tile } from "./models/tile.js";

export const saveGameState = async (c) => {
  const fileName = await c.req.query("name");
  const game = c.get("game");
  const data = game.getCurrentGameState();
  Deno.writeTextFileSync(
    `./game-states/${fileName}.json`,
    JSON.stringify(data),
    { create: true },
  );
  return c.redirect("/pages/game.html");
};

export const loadGameState = async (c) => {
  const game = c.get("game");
  const fileName = await c.req.query("name");
  const jsondata = Deno.readTextFileSync(`./game-states/${fileName}.json`);
  const data = createInstances(JSON.parse(jsondata));
  game.loadGameState(data);
  return c.redirect("/pages/game.html");
};

const createInstances = (data) => {
  data.hotels.forEach((hotel) => {
    hotel.tiles = hotel.tiles.map(({ id }) => new Tile(id));
    if (hotel.originTile) {
      hotel.originTile = new Tile(hotel.originTile.id);
    }
  });

  data.players = data.players.map((playerDetails) => {
    const player = new Player();
    player.loadGameState(playerDetails);
    return player;
  });

  data.board.placedTileIds = data.board.placedTileIds.map((id) => new Tile(id));
  return data;
};
