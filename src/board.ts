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
    this.grid = [];
  }
}
