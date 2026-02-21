import { Board } from './board'
import type { GameStatus } from './board'

/**
 * Game is responsible for managing the lifecycle of Minesweeper.
 * It owns the Board instance and provides a clean API for the UI.
 */
export class Game {
  private board: Board
  private gameOver = false

  constructor(rows: number, cols: number, mineCount: number) {
    this.board = new Board(rows, cols, mineCount)
  }

  /**
   * Resets the game by creating a brand new board.
   */
  reset(rows: number, cols: number, mineCount: number): void {
    this.board = new Board(rows, cols, mineCount)
     this.gameOver = false;
  }

  getBoard(): Board {
    return this.board
  }

  getStatus(): GameStatus {
    return this.board.status
  }

  revealCell(row: number, col: number): void {
    this.board.revealCell(row, col)
    if (this.board.status === "lost") {
    this.gameOver = true;  
    this.board.revealAllMines();
  }
  }

  toggleFlag(row: number, col: number): void {
    this.board.toggleFlag(row, col)
  }

  isGameOver(): boolean {
    return this.gameOver;
  }
}
