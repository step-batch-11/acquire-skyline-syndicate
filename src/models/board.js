import { Tile } from "./tile.js";

export class Board {
  #tiles;
  #placedTiles;

  constructor(tiles) {
    this.#tiles = tiles;
  }

  place(coordinate) {
    const tile = this.#tiles[coordinate.x][coordinate.y];
    tile.markAsPlaced();
  }

  static create(rowCount, columnCount) {
    const rows = new Array(rowCount).fill();
    const tiles = rows.map((_, rowId) =>
      new Array(columnCount).fill().map((_, colId) => new Tile(rowId, colId))
    );
    return new Board(tiles);
  }
}
