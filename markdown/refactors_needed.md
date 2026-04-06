# hotel.js

- [ ] Don't need to push originTile anymore

```js
this.#originTile = originTile;
this.#tiles.push(originTile);
```

- [ ] Just found a pattern

```js
#getNumberOfTiles() {
  const count = this.#tiles.length;
  if (count <= 5) return count;
  if (count <= 10) return 6;
  return Math.floor(count / 10) + 6;
  // if (count <= 20) return 7;
  // if (count <= 30) return 8;
  // if (count <= 40) return 9;
  // return 10;
}
```

- [ ] Could use structured clone because this makes a shallow copy

```js
getTiles() {
  return [...this.#tiles];
}
```

# hotels.js

- [ ] Tile could be instanciated outside and passed

```js
expand(tileId) {
  const hotel = Object.values(this.#hotels).find((hotel) => {
    const tiles = hotel.getTiles();
    return tiles.some((tile) => tile.isNeighbouringTile(new Tile(tileId)));
  });
  hotel.addTiles([new Tile(tileId)]);
  return hotel;
}
```

- [ ] Not readable.. Can be broken down

```js
calculateMoneyToDeduct(cart) {
  return cart.reduce((calculatedMoney, { hotelName, selectedStocks }) => {
    return (calculatedMoney +=
      this.#hotels[hotelName.toLowerCase()].calculateStockPrice() *
      selectedStocks);
  }, 0);
}
```

- [ ] Can be broken down for better readability

```js
const hotel = this.#hotels[hotelName.toLowerCase()];
hotel.deecreaseStockCount();
```

```js
deductStocks(cart) {
  cart.forEach(({ hotelName, selectedStocks }) => {
    this.#hotels[hotelName.toLowerCase()].decreaseStockCount(selectedStocks);
  });
}
```

# board.js

- [ ] Mapping it for no reason?

```js
isTileOnBoard(tileId) {
  const placedTileIds = this.#placedTiles.map((tile) => tile);
  return placedTileIds.includes(tileId);
}
```

- [ ] Can send array of tiles as strings only instead of object

```js
getPlacedTiles() {
  return this.#placedTiles.map((tile) => ({ id: tile.id }));
}
```

- [ ] I think name is too generic. Could be placeTileOnBoard or a bit more
      explicit

```js
place(tile) {
  this.#placedTiles.push(tile);
  this.lastTile = tile;
}
```

# Game.js

- [ ] Can call the currentState function instead of returning the object inside
      and outside if
- [ ] As we have `actionForTilePlacement` method so no need of having nested if
      in placeTile method

```js
#actionForTilePlacement(tileId) {
  if (this.#isGoingToMerge()) return (this.#state = "MERGE");
  if (this.#isExpansion()) return this.expandHotel(tileId);
  if (this.#isBuildPossible()) return (this.#state = "BUILD_HOTEL");
  this.#state = "NO_ACTION";
}

placeTile(tileId) {
  if (this.#isValidTilePlacement(tileId)) {
    this.#board.place(new Tile(tileId));
    this.#actionForTilePlacement(tileId);
    if (this.#isExpansion(tileId)) this.expandHotel(tileId);
    const playerTiles = this.#currentPlayer.removeTile(tileId);
    return {
      playerTiles,
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
    };
  }
  return {
    playerTiles: this.#currentPlayer.getTileIds(),
    tilesOnBoard: this.#board.getPlacedTiles(),
    state: "NO_ACTION",
  };
}
```

- [ ] Should have a getter function which will give the lastTile.

```js
buildHotel(hotelName) {
  const lastTile = this.#board.lastTile;
  const adjacentTiles = this.#board.adjacentTilesOfLastTile();
  this.#hotels.foundHotel(hotelName, lastTile, adjacentTiles);
  this.#currentPlayer.addStocks(hotelName, 1);
}
```

- [ ] Instead of returning game.currentState() could be called.

```js
buyStocks(cart) {
  this.#hotels.deductStocks(cart);
  const hotels = this.#hotels.getHotels();
  cart.forEach(({ hotelName, selectedStocks }) =>
    this.#currentPlayer.addStocks(hotelName.toLowerCase(), selectedStocks),
  );
  const moneyToDeduct = this.#hotels.calculateMoneyToDeduct(cart);
  this.#currentPlayer.deductMoney(moneyToDeduct);
  const playerInfo = this.#currentPlayer.getDetails();
  return { hotels, playerInfo };
}
```

# Lobby.js

- [ ] createTile and shuffleFunciton could be injected

```js
createGame(activePlayers) {
  const tiles = createTiles();
  const deck = new Deck(shuffleTiles(tiles));
  const board = new Board();
  const hotelsManager = Hotels.instantiateHotels(bankData);
  const players = activePlayers.map((player, i) => new Player(player, i));
  // const player = new Player("Gopi", 1);
  this.#game = new Game(deck, board, hotelsManager, players);
  this.#game.init();
}
```

# player.js

- [ ] We're using this method only inside this class. Can make it private

```js
getTileIds() {
  return this.#tiles.map((tile) => tile.id);
}
```

- [ ] Why returning tile ids after adding? Because we're returning currentState

```js
addNewTile(tile) {
  this.#tiles.push(...tile);
  return this.getTileIds();
}
```

# handlers

- [ ] All handlers are returning the data which is comming after performing the
      operation. Instead it can return the currentState of the game. If the
      request is related to game.

# lobbyRouter :

- [ ] Request that changes the state, it should be not be get. change it to post
      frontend and backend both.

```js
lobby.post("/join", joinLobby);
lobby.get("/state", currentState);
lobby.get("/create-game", createGame);
lobby.get("/start-game", gameState);
lobby.get("/active-players", activePlayers);
```
