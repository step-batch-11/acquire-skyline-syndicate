import { Tile } from "./tile.js";
new Tile();
export class Game {
  #deck;
  #board;
  #hotels;
  #currentPlayer;
  #state;
  #players;
  #currentPlayerIndex;

  constructor(deck, board, hotels, players) {
    this.#deck = deck;
    this.#board = board;
    this.#hotels = hotels;
    this.#currentPlayerIndex = 0;
    this.#currentPlayer = players[this.#currentPlayerIndex];
    this.#players = players;
    this.#state = "PLACE_TILE";
  }

  init() {
    const initialBoardTiles = this.#deck.drawTiles(6);
    initialBoardTiles.forEach((tile) => this.#board.place(tile));
    this.#players.forEach((player) => {
      const initialPlayerTiles = this.#deck.drawTiles(6);
      player.addInitialTiles(initialPlayerTiles.map((tile) => tile));
    });
  }

  currentState(requestedPlayerId) {
    return {
      player: this.#players
        .find((player) => player.id === requestedPlayerId)
        .getDetails(),
      currentPlayer: { name: this.#currentPlayer.name },
      hotels: this.#hotels.getHotels(),
      tilesOnBoard: this.#board.getPlacedTiles(),
      state: this.#state,
      players: this.#players.map((player) => ({
        name: player.name,
      })),
      isActivePlayer: this.#currentPlayer.id === requestedPlayerId,
    };
  }

  #isBuildPossible() {
    const adjacentTiles = this.#board.lastTile.neighbourTiles();
    const notInAnyHotel = !adjacentTiles.some((tile) =>
      this.#hotels.isTileInAnyHotel(tile)
    );

    return (
      this.#hotels.isAnyInActiveHotel() &&
      this.#board.hasAdjacentForLastTile() &&
      notInAnyHotel
    );
  }

  #isValidTilePlacement(tileId) {
    if (!this.#currentPlayer.isPlayerTile(tileId)) return false;
    if (this.#board.isTileOnBoard(tileId)) return false;
    return true;
  }

  #isExpansion() {
    const adjacentTiles = this.#board.lastTile.neighbourTiles();
    return adjacentTiles.some((tile) => this.#hotels.isTileInAnyHotel(tile));
  }

  #getAdjacentHotelChains() {
    const adjacentTiles = this.#board.adjacentTilesOfLastTile();
    return this.#hotels.getAdjacentHotelChains(adjacentTiles);
  }

  #distributeBonus() {}

  #stakeHolders(hotelName) {
    return this.#players.filter((player) => player.hasStock(hotelName));
  }

  #mergeHotels(adjacentHotelChains) {
    const sortedHotels = adjacentHotelChains.sort(
      (a, b) => a.tiles.length - b.tiles.length,
    );

    const [defunctHotel, survivingHotel] = sortedHotels.map((hotel) =>
      this.#hotels.getHotel(hotel.name)
    );
    survivingHotel.addTiles([...defunctHotel.getTiles(), this.#board.lastTile]);
    const stakeholders = this.#stakeHolders(defunctHotel.name);
    this.#distributeBonus(stakeholders);
    defunctHotel.dissolve();
  }

  #actionForTilePlacement(tileId) {
    const adjacentHotelChains = this.#getAdjacentHotelChains();
    if (adjacentHotelChains.length > 1) {
      this.#mergeHotels(adjacentHotelChains);
      this.#state = "BUY_STOCK";
      return;
    }
    if (this.#isBuildPossible()) {
      return "BUILD_HOTEL";
    }
    if (this.#isExpansion()) {
      this.expandHotel(tileId);
    }
    return "BUY_STOCK";
  }

  #areStocksValid(cart) {
    const totalStocks = cart.reduce(
      (count, { selectedStocks }) => (count += selectedStocks),
      0,
    );

    return totalStocks <= 3 && totalStocks >= 0;
  }

  #isValidPurchase(cart) {
    return (
      this.#areStocksValid(cart) &&
      this.#hotels.areCartHotelsActive(cart) &&
      this.#hotels.hasEnoughStocksToBuy(cart)
    );
  }

  placeTile(tileId) {
    if (this.#state === "PLACE_TILE" && this.#isValidTilePlacement(tileId)) {
      this.#board.place(new Tile(tileId));
      this.#state = this.#actionForTilePlacement(tileId);

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

  expandHotel(tileId) {
    const tilesOnBoard = this.#board.getPlacedTiles();
    this.#hotels.expand(tileId, tilesOnBoard);
  }

  buildHotel(hotelName) {
    if (this.#state !== "BUILD_HOTEL") {
      return;
    }
    if (this.#hotels.isHotelActive(hotelName)) return "hotel is already active";
    const lastTile = this.#board.lastTile;
    const adjacentTiles = this.#board.adjacentTilesOfLastTile();
    this.#hotels.foundHotel(hotelName, lastTile, adjacentTiles);
    this.#currentPlayer.addStocks(hotelName, 1);
    this.#state = "BUY_STOCK";
  }

  assignNewTile() {
    const tile = this.#deck.drawTiles(1);
    this.#currentPlayer.addNewTile(tile);
  }

  buyStocks(cart) {
    if (this.#state !== "BUY_STOCK") {
      return;
    }
    const moneyToDeduct = this.#hotels.calculateMoneyToDeduct(cart);
    const isValidBuy = this.#isValidPurchase(cart) &&
      this.#currentPlayer.hasEnoughMoney(moneyToDeduct);

    if (isValidBuy) {
      this.#hotels.deductStocks(cart);
      const hotels = this.#hotels.getHotels();
      cart.forEach(({ hotelName, selectedStocks }) =>
        this.#currentPlayer.addStocks(hotelName, selectedStocks)
      );
      this.#currentPlayer.deductMoney(moneyToDeduct);
      this.#state = "SHIFT_TURN";
      const playerInfo = this.#currentPlayer.getDetails();
      return { hotels, playerInfo, state: this.#state };
    }
  }

  shiftTurn() {
    if (this.#state !== "SHIFT_TURN") {
      return;
    }
    this.assignNewTile();
    this.#currentPlayer =
      this.#players[++this.#currentPlayerIndex % this.#players.length];
    this.#state = "PLACE_TILE";
  }

  getCurrentGameState() {
    const players = this.#players.map((player) => player.getPlayerState());
    return {
      board: this.#board.getBoardState(),
      deck: this.#deck.getDeckState(),
      hotels: this.#hotels.getHotelsState(),
      players,
      state: this.#state,
      // currentPlayer :this.#currentPlayer,
      currentPlayerIndex: this.#currentPlayerIndex,
    };
  }

  loadGameState(data) {
    this.#state = data.state;
    this.#currentPlayer =
      data.players[data.currentPlayerIndex % data.players.length];
    this.#currentPlayerIndex = data.currentPlayerIndex;
    this.#deck.loadGameState(data.deck);
    this.#players = data.players;
    this.#board.loadGameState(data.board);
    this.#hotels.loadGameState(data.hotels);
  }
}
