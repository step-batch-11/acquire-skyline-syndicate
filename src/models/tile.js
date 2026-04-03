export class Tile {
  id;
  #columnLabels;
  constructor(tileId) {
    this.#columnLabels = "abcdefghi";
    this.id = tileId;
  }

  isNeighbouringTile(tile) {
    return this.#isNeighbourByRow(tile) || this.#isNeighbourByColumn(tile);
  }

  #labelIndex(tileId) {
    return this.#columnLabels.indexOf(tileId.slice(-1));
  }

  #isNeighbourByColumn(tile) {
    const difference = Math.abs(
      this.#labelIndex(this.id) - this.#labelIndex(tile.id),
    );
    return difference === 0;
  }

  #isNeighbourByRow(tile) {
    const currentTileRow = this.id.slice(0, this.id.length - 1);
    const newTileRow = tile.id.slice(0, tile.id.length - 1);
    const difference = Math.abs(currentTileRow - newTileRow);

    return difference === 0;
  }
}
