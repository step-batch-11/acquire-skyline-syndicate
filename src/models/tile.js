export class Tile {
  id;
  #rowLabels;
  constructor(tileId) {
    this.#rowLabels = "abcdefghi";
    this.id = tileId;
  }

  splitTile(tile) {
    return { col: tile.slice(0, tile.length - 1), row: tile.slice(-1) };
  }

  neighbourTiles() {
    const tilePositions = this.splitTile(this.id);
    return [
      this.topNeighbour(tilePositions),
      this.bottomNeighbour(tilePositions),
      this.leftNeighbour(tilePositions),
      this.rightNeighbour(tilePositions),
    ];
  }

  isNeighbouringTile(tile) {
    const adjacents = this.neighbourTiles();

    return adjacents.includes(tile.id) && tile.id !== this.id;
  }

  createTile(col, row) {
    return `${col}${row}`;
  }

  getColumnLabel(col) {
    return Number(col);
  }

  getRowLabel(row) {
    return Number(this.#rowLabels.indexOf(row));
  }

  topNeighbour({ row, col }) {
    const top = this.getRowLabel(row) - 1;
    const updatedTopRow = top === -1
      ? this.#rowLabels[0]
      : this.#rowLabels[top];

    return this.createTile(col, updatedTopRow);
  }

  bottomNeighbour({ row, col }) {
    const bottom = this.getRowLabel(row) + 1;
    const updatedBottomRow = bottom === 9
      ? this.#rowLabels[8]
      : this.#rowLabels[bottom];

    return this.createTile(col, updatedBottomRow);
  }

  leftNeighbour({ row, col }) {
    const left = this.getColumnLabel(col) - 1;
    const updatedLeftColumn = left === 0 ? 1 : left;

    return this.createTile(updatedLeftColumn, row);
  }

  rightNeighbour({ row, col }) {
    const right = this.getColumnLabel(col) + 1;
    const updatedLeftColumn = right === 13 ? 12 : right;

    return this.createTile(updatedLeftColumn, row);
  }
}
