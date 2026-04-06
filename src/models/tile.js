export class Tile {
  id;
  #rowLabels;
  #maxCol;
  #minCol;
  #neighbourDeltas;
  constructor(tileId) {
    this.#maxCol = 12;
    this.#minCol = 1;
    this.#rowLabels = "abcdefghi";
    this.id = tileId;
    this.#neighbourDeltas = [
      { columnDelta: 1, rowDelta: 0 },
      { columnDelta: -1, rowDelta: 0 },
      { columnDelta: 0, rowDelta: 1 },
      { columnDelta: 0, rowDelta: -1 },
    ];
  }

  #getRowIndex(row) {
    return this.#rowLabels.indexOf(row);
  }

  #isValidColumn(col) {
    return col >= this.#minCol && col <= this.#maxCol;
  }

  #isValidRow(row) {
    return this.#getRowIndex(row) !== -1;
  }

  splitTile(tile) {
    return { col: Number(tile.slice(0, -1)), row: tile.slice(-1) };
  }

  #getUpdatedRow(row, rowDelta) {
    const rowIndex = this.#getRowIndex(row);
    return this.#rowLabels[rowIndex + rowDelta];
  }

  #getUpdatedPosition({ columnDelta, rowDelta }) {
    const { col, row } = this.splitTile(this.id);

    return {
      newColumn: col + columnDelta,
      newRow: this.#getUpdatedRow(row, rowDelta),
    };
  }

  addNeighbour(delta) {
    const { newColumn, newRow } = this.#getUpdatedPosition(delta);

    return this.#isValidRow(newRow) && this.#isValidColumn(newColumn)
      ? `${newColumn}${newRow}`
      : null;
  }

  neighbourTiles() {
    return this.#neighbourDeltas
      .map((delta) => this.addNeighbour(delta))
      .filter(Boolean);
  }

  isNeighbouringTile(tile) {
    return this.neighbourTiles().includes(tile.id);
  }

  getAllConnectedTiles(tilesOnBoard, connecteds = []) {
    if (connecteds.includes(this.id)) return connecteds;

    connecteds.push(this.id);
    this.neighbourTiles().forEach((tile) => {
      if (tilesOnBoard.some((tileOnBoard) => tileOnBoard.id === tile)) {
        const tileInstance = new Tile(tile);
        tileInstance.getAllConnectedTiles(tilesOnBoard, connecteds);
      }
    });

    return connecteds;
  }
}
