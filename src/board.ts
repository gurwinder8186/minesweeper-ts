import type { Cell } from "./cell";

/**
 * Returns a set of unique random "row,col" positions for mine placement.
 * Pure function: does not modify board state.
 */
function getRandomMinePositions(
  rows: number,
  cols: number,
  mineCount: number
): Set<string> {
  const positions = new Set<string>();

  // Generate unique positions until we reach the mine count
  while (positions.size < mineCount) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);

    positions.add(`${row},${col}`);
  }

  return positions;
}

export class Board {
  readonly rows: number;
  readonly cols: number;
  readonly mineCount: number;
  readonly grid: Cell[][];

  constructor(rows: number, cols: number, mineCount: number) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;
    this.grid = this.initializeGrid();
    this.placeMines();
  }

private initializeGrid(): Cell[][] {
  const grid: Cell[][] = [];

  for (let row = 0; row < this.rows; row++) {
    const currentRow: Cell[] = [];

    for (let col = 0; col < this.cols; col++) {
      currentRow.push({
        row,
        col,
        isMine: false,
        isFlagged: false,
        isRevealed: false,
        surroundingMines: 0,
      });
    }

    grid.push(currentRow);
  }

  return grid;
}

/**
 * Places mines at random positions on the board.
 * Requires the grid to be initialized beforehand.
 */
private placeMines(): void {
  const minePositions = getRandomMinePositions(
    this.rows,
    this.cols,
    this.mineCount
  );

  for (const position of minePositions) {
    const [row, col] = position.split(",").map(Number);

    // Mark this cell as a mine
    this.grid[row][col].isMine = true;
  }
}

}
