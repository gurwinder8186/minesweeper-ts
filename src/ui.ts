import type { Game } from "./game";
import type { Cell } from "./cell";

/**
 * UI is responsible for rendering the board and handling DOM events.
 * It never mutates board state directly — it only calls Game methods.
 */
export class UI {
  private root: HTMLElement;
  private game: Game;

  constructor(root: HTMLElement, game: Game) {
    this.root = root;
    this.game = game;
  }

  render(): void {
    const board = this.game.getBoard();

    // Clear previous UI
    this.root.innerHTML = "";

    const gridElement = document.createElement("div");
    gridElement.className = "grid";

    for (let row = 0; row < board.rows; row++) {
      for (let col = 0; col < board.cols; col++) {
        const cell = board.grid[row][col];
        const cellElement = this.createCellElement(cell);

        cellElement.addEventListener("click", () => {
          this.game.revealCell(row, col);
          this.render();
        });

        cellElement.addEventListener("contextmenu", (event) => {
          event.preventDefault();
          this.game.toggleFlag(row, col);
          this.render();
        });

        gridElement.appendChild(cellElement);
      }
    }

    this.root.appendChild(gridElement);
  }

  private createCellElement(cell: Cell): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "cell";

    if (cell.isRevealed) {
      button.classList.add("revealed");

      if (cell.isMine) {
        button.textContent = "💣";
      } else if (cell.surroundingMines > 0) {
        button.textContent = String(cell.surroundingMines);
      } else {
        button.textContent = "";
      }
    } else if (cell.isFlagged) {
      button.textContent = "🚩";
    } else {
      button.textContent = "";
    }

    return button;
  }
}
