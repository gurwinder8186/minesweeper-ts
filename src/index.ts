import "./style.css";
import { Game } from "./game";
import { UI } from "./ui";

// Default board settings (we can add difficulty later)
const ROWS = 10;
const COLS = 10;
const MINES = 15;

const root = document.querySelector<HTMLDivElement>("#app");

if (!root) {
  throw new Error("Root element #app not found");
}

const game = new Game(ROWS, COLS, MINES);
const ui = new UI(root, game);

ui.render();
