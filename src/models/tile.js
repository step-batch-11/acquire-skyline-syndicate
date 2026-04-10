export class Tile {
  #id;
  #rowLabels;
  #maxCol;
  #minCol;
  #neighbourDeltas;
  #isPlayable;
  constructor(tileId) {
    this.#maxCol = 12;
    this.#minCol = 1;
    this.#rowLabels = "abcdefghi";
    this.#id = tileId;
    this.#neighbourDeltas = [
      { columnDelta: 1, rowDelta: 0 },
      { columnDelta: -1, rowDelta: 0 },
      { columnDelta: 0, rowDelta: 1 },
      { columnDelta: 0, rowDelta: -1 },
    ];
    this.#isPlayable = true;
  }

  get id() {
    return this.#id;
  }

  get isPlayable() {
    return this.#isPlayable;
  }

  set isPlayable(value) {
    this.#isPlayable = value;
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

  #parseTileId(tileId) {
    return { col: Number(tileId.slice(0, -1)), row: tileId.slice(-1) };
  }

  #getUpdatedRow(row, rowDelta) {
    const rowIndex = this.#getRowIndex(row);
    return this.#rowLabels[rowIndex + rowDelta];
  }

  #getUpdatedPosition({ columnDelta, rowDelta }) {
    const { col, row } = this.#parseTileId(this.id);

    return {
      newColumn: col + columnDelta,
      newRow: this.#getUpdatedRow(row, rowDelta),
    };
  }

  #getNeighbour(delta) {
    const { newColumn, newRow } = this.#getUpdatedPosition(delta);

    return this.#isValidRow(newRow) && this.#isValidColumn(newColumn)
      ? `${newColumn}${newRow}`
      : null;
  }

  neighbourTiles() {
    return this.#neighbourDeltas
      .map((delta) => this.#getNeighbour(delta))
      .filter(Boolean);
  }

  isNeighbour(tile) {
    return this.neighbourTiles().includes(tile.id);
  }

  getAllConnectedTiles(tilesOnBoard, connectedTiles = []) {
    if (connectedTiles.includes(this.id)) return connectedTiles;

    connectedTiles.push(this.id);
    this.neighbourTiles().forEach((tile) => {
      if (tilesOnBoard.some((tileOnBoard) => tileOnBoard.id === tile)) {
        const tileInstance = new Tile(tile);
        tileInstance.getAllConnectedTiles(tilesOnBoard, connectedTiles);
      }
    });

    return connectedTiles;
  }
}
