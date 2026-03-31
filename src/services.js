import { shuffle } from "@std/random";

export class Services {
  #tiles;
  #hotels;
  #unplacedTiles;
  #player;
  #placedTiles;
  #lastTile;
  #HOTEL_PRICE_SCALE = {
    "Continental": 200,
    "Imperial": 200,
    "American": 100,
    "Festival": 100,
    "Worldwide": 100,
    "Sackson": 0,
    "Tower": 0,
  };

  constructor(tiles, hotels) {
    this.#player = { amount: 6000 };
    this.#tiles = tiles;
    this.#hotels = hotels;
  }

  #shuffleTiles(shuffleFn) {
    this.#unplacedTiles = shuffleFn(this.#tiles);
  }

  #allocateTilesToPlayers() {
    const playerTiles = this.#unplacedTiles.splice(0, 6);
    this.#player.playerTiles = playerTiles;
  }

  #placeTiles() {
    this.#placedTiles = this.#unplacedTiles.splice(0, 6);
  }

  placeTileOnBoard(tile, engine) {
    const action = engine.actionForPlacingTile(tile, this.#placedTiles);
    const result = this.updatePlayerTiles(tile);
    this.#lastTile = tile;
    return { ...result, action };
  }

  buildHotel(hotel) {
    this.#hotels[hotel].orginTile = this.#lastTile;
    this.#hotels[hotel].tiles.push(this.#lastTile);
  }

  getHotel() {
    return this.#hotels;
  }

  updatePlayerTiles(tile) {
    const playerTiles = this.#player.playerTiles;
    const tileIndex = playerTiles.indexOf(tile);
    playerTiles.splice(tileIndex, 1);
    this.#placedTiles.push(tile);
    return { playerTiles, tilesOnBoard: this.#placedTiles };
  }

  assignNewTile(shuffleFn = shuffle) {
    const newTile = shuffleFn(this.#unplacedTiles)[0];
    const playerTiles = this.#player.playerTiles;
    playerTiles.push(newTile);
    return { playerTiles, tilesOnBoard: this.#placedTiles };
  }

  initialSetup(shuffleFn = shuffle) {
    this.#shuffleTiles(shuffleFn);
    this.#placeTiles();
    this.#allocateTilesToPlayers();
    return {
      ...this.#player,
      tilesOnBoard: this.#placedTiles,
      bankData: this.#hotels,
    };
  }

  #getNumberOfTiles(tiles) {
    if (tiles.length >= 6 && tiles.length <= 10) {
      return 6;
    }
    if (tiles.length >= 11 && tiles.length <= 20) {
      return 7;
    }
    if (tiles.length >= 21 && tiles.length <= 30) {
      return 8;
    }
    if (tiles.length >= 31 && tiles.length <= 40) {
      return 9;
    }
    if (tiles.length >= 41) {
      return 10;
    }
    return tiles.length;
  }

  getCurrentStockPrice(hotel) {
    const numberOfTiles = this.#getNumberOfTiles(hotel.tiles);
    const scale = this.#HOTEL_PRICE_SCALE[hotel.hotelName];

    return numberOfTiles * 100 + scale;
  }

  expandHotel(tile, hotelName) {
    this.#hotels[hotelName].tiles.push(tile);
    return { hotelName, ...this.#hotels[hotelName] };
  }
}
