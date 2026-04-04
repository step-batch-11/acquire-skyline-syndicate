export class Tile {
  id;
  #rowLabels;
  #maxCol;
  #minCol;
  constructor(tileId) {
    this.#maxCol = 12;
    this.#minCol = 1;
    this.#rowLabels = "abcdefghi";
    this.id = tileId;
  }

  splitTile(tile) {
    return { col: tile.slice(0, tile.length - 1), row: tile.slice(-1) };
  }

  updateColumn(col, dc) {
    const newCol = col + dc;
    if (newCol < this.#minCol) return 1;
    if (newCol > this.#maxCol) return 12;
    return newCol;
  }

  updateRowIndex(row, dr) {
    const newRow = this.getRowIndex(row) + dr;
    if (newRow < 0) return 0;
    if (newRow > 8) return 8;
    return newRow;
  }

  neighbourTiles() {
    const neighbours = [
      { columnDelta: 1, rowDelta: 0 },
      { columnDelta: -1, rowDelta: 0 },
      { columnDelta: 0, rowDelta: 1 },
      { columnDelta: 0, rowDelta: -1 },
    ];
    const currentTile = this.splitTile(this.id);

    const adjacents = neighbours.map(({ columnDelta, rowDelta }) => {
      const updatedCol = this.updateColumn(
        Number(currentTile.col),
        columnDelta,
      );
      const updatedRowIndex = this.updateRowIndex(currentTile.row, rowDelta);
      const updatedRow = this.#rowLabels[updatedRowIndex];

      return `${updatedCol}${updatedRow}`;
    });
    return adjacents;
  }

  isNeighbouringTile(tile) {
    if (this.id === tile.id) return false;

    const currentTilePosition = this.splitTile(this.id);
    const newTilePosition = this.splitTile(tile.id);

    const rowDifference = Math.abs(
      this.getRowIndex(currentTilePosition.row) -
        this.getRowIndex(newTilePosition.row),
    );
    const columnDifference = Math.abs(
      currentTilePosition.col - newTilePosition.col,
    );
    const difference = rowDifference + columnDifference;

    return difference === 1;
  }

  getRowIndex(row) {
    return Number(this.#rowLabels.indexOf(row));
  }
}
