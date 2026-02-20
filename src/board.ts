import type { Cell } from "./cell";

export type GameStatus = "playing" | "won" | "lost";


// Relative positions of the 8 neighboring cells
const NEIGHBOR_DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

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
  status: GameStatus= "playing";
  private isFirstMove: boolean = true;


  constructor(rows: number, cols: number, mineCount: number) {
    this.rows = rows;
    this.cols = cols;
    this.mineCount = mineCount;
    this.grid = this.initializeGrid();
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

/**
 * Counts how many mines surround a given cell position.
 */
private countSurroundingMines(row: number, col: number): number {
  let count = 0;

  for (const [rowOffset, colOffset] of NEIGHBOR_DIRECTIONS) {
    const neighborRow = row + rowOffset;
    const neighborCol = col + colOffset;

    // Skip out-of-bounds neighbors
    if (
      neighborRow < 0 ||
      neighborRow >= this.rows ||
      neighborCol < 0 ||
      neighborCol >= this.cols
    ) {
      continue;
    }

    if (this.grid[neighborRow][neighborCol].isMine) {
      count++;
    }
  }

  return count;
}

/**
 * Calculates surrounding mine counts for all non-mine cells.
 * Should be called after mines are placed.
 */
private calculateSurroundingMines(): void {
  for (let row = 0; row < this.rows; row++) {
    for (let col = 0; col < this.cols; col++) {
      const cell = this.grid[row][col];

      if (cell.isMine) {
        continue;
      }

      cell.surroundingMines = this.countSurroundingMines(row, col);
    }
  }
}

/**
 * Reveals a cell. Stops if flagged, already revealed, or a mine.
 * Expands automatically when the cell has zero neighboring mines.
 */

revealCell(row: number, col: number): void {
  // Ignore input if game is already over
  if (this.status !== "playing") {
    return;
  }

  const cell = this.grid[row][col];

  if (cell.isRevealed || cell.isFlagged) {
    return;
  }

  cell.isRevealed = true;

  // Revealing a mine ends the game
  if (cell.isMine) {
    this.status = "lost";
    return;
  }

  if (cell.surroundingMines === 0) {
    this.revealAdjacentCells(row, col);
  }

  this.checkWinCondition();
}


/**
 * Flood‑fills outward from an empty cell, revealing neighbors.
 */
private revealAdjacentCells(row: number, col: number): void {
  for (const [rowOffset, colOffset] of NEIGHBOR_DIRECTIONS) {
    const neighborRow = row + rowOffset;
    const neighborCol = col + colOffset;

// Skip neighbors outside the board
    if (
      neighborRow < 0 ||
      neighborRow >= this.rows ||
      neighborCol < 0 ||
      neighborCol >= this.cols
    ) {
      continue;
    }

    const neighbor = this.grid[neighborRow][neighborCol];

// Skip cells already revealed or flagged
    if (neighbor.isRevealed || neighbor.isFlagged) {
      continue;
    }

    neighbor.isRevealed = true;

// Recurse only into empty neighbors
    if (!neighbor.isMine && neighbor.surroundingMines === 0) {
      this.revealAdjacentCells(neighborRow, neighborCol);
    }
  }
}

/**
 * Checks whether all non-mine cells have been revealed.
 * If so, marks the game as won.
 */
private checkWinCondition(): void {
  for (let row = 0; row < this.rows; row++) {
    for (let col = 0; col < this.cols; col++) {
      const cell = this.grid[row][col];

      if (!cell.isMine && !cell.isRevealed) {
        return;
      }
    }
  }

  this.status = "won";
}

/**
 * Toggles a flag on a cell.
 * Flagging is disabled for revealed cells or finished games.
 */
toggleFlag(row: number, col: number): void {
  // Ignore input if game is over
  if (this.status !== "playing") {
    return;
  }

  const cell = this.grid[row][col];

  // Revealed cells cannot be flagged
  if (cell.isRevealed) {
    return;
  }

  cell.isFlagged = !cell.isFlagged;
}

/**
 * Returns the number of currently flagged cells.
 */
getFlagCount(): number {
  let count = 0;

  for (let row = 0; row < this.rows; row++) {
    for (let col = 0; col < this.cols; col++) {
      if (this.grid[row][col].isFlagged) {
        count++;
      }
    }
  }

  return count;
}




}
