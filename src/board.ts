import type { Cell } from "./cell";

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

}
